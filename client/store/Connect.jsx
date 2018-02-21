// @flow
import * as React from 'react';
import { bindActionCreators, type ActionCreator, type ActionCreators, type Dispatch, type DispatchAPI } from 'redux';
import { store } from './';
import shallowEqual from 'fbjs/lib/shallowEqual';

// Wraps action creators with dispatch
// A. Supports passing a function, first argument is the store's dispatch
// B. Supports passing an object whose values are action creators
// @see http://redux.js.org/docs/api/bindActionCreators.html
function mapDispatch(actions: mapDispatchToProps): Actions {
  if (typeof actions === 'function') {
    return actions(store.dispatch);
  }

  return bindActionCreators(actions, store.dispatch);
}

type Actions = {
  dispatch: Dispatch<*>,
  [string]: <A, B>(...args: Array<A>) => B,
};

type mapDispatchToProps = ActionCreators<*, *> | ((dispatch: Dispatch<*>) => Actions);

type Props<S> = {
  state: (state: Object) => S,
  actions?: mapDispatchToProps,
  children: (state: S, actions: Actions) => React.Node,
};

type PropsSlice<S> = {
  state: (state: Object) => S,
  actions?: mapDispatchToProps,
  children: (state: S, actions: Actions) => React.Node,
  ancestor?: ConnectSlice,
};

/*
  Use Context to enforce subscription order:
  Since cDM runs first for descendants, we need a mechanism
  to ensure ancestors subscribe first
*/
//$FlowFixMe
const ConnectContext: Context<ConnectSlice> = React.createContext();

export const Connect = (props: Props<*>) => (
  // Ancestor will be undefined for top level Connect
  <ConnectContext.Consumer>{ancestor => <ConnectSlice ancestor={ancestor} {...props} />}</ConnectContext.Consumer>
);

class ConnectSlice extends React.Component<PropsSlice<*>, *> {
  // Cache actions
  // TODO: Should we support runtime modification of actions/state props?
  actions: Actions = {
    dispatch: store.dispatch,
    ...(this.props.actions && mapDispatch(this.props.actions)),
  };

  // Compute initial state
  state = this.props.state(store.getState());

  unsubscribe: Function | null = null;
  shouldUpdate: boolean = false;

  subscribe() {
    if (this.unsubscribe === null) {
      if (this.props.ancestor) {
        // Subscribe ancestors first
        this.props.ancestor.subscribe();
      }
      this.unsubscribe = store.subscribe(this.onStoreStateChange);
    }
  }

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    if (this.unsubscribe !== null) {
      this.unsubscribe();
    }
  }

  // Fired when redux state changes
  onStoreStateChange = this.onStoreStateChange.bind(this);
  onStoreStateChange() {
    this.setState((prevState, props) => {
      const nextState = props.state(store.getState());
      // Force update if ancestor <Connect /> had an update.
      // This is required because children of Slice descendants may
      // require a prop from an ancestor. e.g.:
      // AncestorConnect => SomeProps => DescendantConnect => ChildDependsOn<SomeProps>
      this.shouldUpdate = (props.ancestor && props.ancestor.shouldUpdate) || !shallowEqual(prevState, nextState);
      return this.shouldUpdate ? nextState : null;
    });
  }

  shouldComponentUpdate() {
    return this.shouldUpdate;
  }

  componentDidUpdate() {
    this.shouldUpdate = false;
  }

  render() {
    return (
      <ConnectContext.Provider value={this}>{this.props.children(this.state, this.actions)}</ConnectContext.Provider>
    );
  }
}
