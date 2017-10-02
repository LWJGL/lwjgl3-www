// @flow
import * as React from 'react';
import { bindActionCreators, type ActionCreator, type ActionCreators, type Dispatch, type DispatchAPI } from 'redux';
import store from './';

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

class Connect extends React.PureComponent<Props<*>, Object> {
  unsubscribe: () => void;
  actions: Actions;

  storeListener = () => {
    this.setState(this.props.state(store.getState()));
  };

  mapDispatch(actions: mapDispatchToProps): Actions {
    if (typeof actions === 'function') {
      return actions(store.dispatch);
    }

    return bindActionCreators(actions, store.dispatch);
  }

  constructor(props: Props<*>) {
    super(props);
    this.actions = { dispatch: store.dispatch, ...(this.props.actions && this.mapDispatch(this.props.actions)) };
    this.state = this.props.state(store.getState());
  }

  componentWillReceiveProps(nextProps: Props<*>) {
    this.actions = { dispatch: store.dispatch, ...(nextProps.actions && this.mapDispatch(nextProps.actions)) };
    this.setState(nextProps.state(store.getState()));
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(this.storeListener);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return this.props.children(this.state, this.actions);
  }
}

export default Connect;
