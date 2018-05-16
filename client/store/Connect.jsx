// @flow
import * as React from 'react';
import { bindActionCreators, type ActionCreators, type Dispatch } from 'redux';
import { store } from './';
// import shallowEqual from 'fbjs/lib/shallowEqual';
import { StoreContext } from './Context';
import memoize from 'memoize-state';

type Actions = {
  dispatch: Dispatch<any>,
  [string]: <A, B>(...args: Array<A>) => B,
};

type mapDispatchToProps = ActionCreators<any, any> | ((dispatch: Dispatch<any>) => Actions);

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

type Props<S> = {
  state: (state: Object) => S,
  actions?: mapDispatchToProps,
  children: (state: S, actions: Actions) => React.Node,
};

type PropsSlice<S> = {
  storeState: Object,
  children: (state: S, actions: Actions) => React.Node,
  state: (state: Object) => S,
  actions?: mapDispatchToProps,
};

export class Slice extends React.Component<PropsSlice<any>, any> {
  // Cache actions
  actions: Actions = {
    dispatch: store.dispatch,
    ...(this.props.actions && mapDispatch(this.props.actions)),
  };

  state = {
    selector: memoize(this.props.state),
    result: null,
  };

  static getDerivedStateFromProps(nextProps: PropsSlice<any>, prevState: any) {
    const result = prevState.selector(nextProps.storeState);
    // return shallowEqual(prevState, nextState) ? null : nextState;
    return prevState.result === result ? null : { result };
  }

  shouldComponentUpdate(nextProps: PropsSlice<any>, nextState: any) {
    return nextState.result !== this.state.result;
  }

  render() {
    return this.props.children(this.state.result, this.actions);
  }
}

export function Connect(props: Props<any>) {
  const { children, state, actions } = props;
  return (
    <StoreContext.Consumer>
      {storeState => (
        <Slice storeState={storeState} state={state} actions={actions}>
          {children}
        </Slice>
      )}
    </StoreContext.Consumer>
  );
}
