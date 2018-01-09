// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, type ActionCreator, type ActionCreators, type Dispatch, type DispatchAPI } from 'redux';
import { store } from './';
import shallowEqual from 'fbjs/lib/shallowEqual';

type Actions = {
  dispatch: Dispatch<*>,
  [string]: <A, B>(...args: Array<A>) => B,
};

type mapDispatchToProps = ActionCreators<*, *> | ((dispatch: Dispatch<*>) => Actions);

type Props<S> = {
  state: (state: Object) => S,
  actions?: mapDispatchToProps,
  render?: (state: S, actions: Actions) => React.Node,
  children?: (state: S, actions: Actions) => React.Node,
};

type Context = {
  connectParent: Connect,
};

export class Connect extends React.Component<Props<*>, *> {
  // Parent will be undefined for top-level <Connect />
  static contextTypes = {
    connectParent: PropTypes.object,
  };

  // Provide this <Connect /> to descendants
  static childContextTypes = {
    connectParent: PropTypes.object,
  };

  getChildContext(): Context {
    return {
      connectParent: this,
    };
  }

  // Fired when redux state changes
  storeListener = this.storeListener.bind(this);
  storeListener() {
    this.setState(this.props.state(store.getState()));
  }

  // Wraps action creators with dispatch
  // A. Supports passing a function, first argument is the store's dispatch
  // B. Supports passing an object whose values are action creators
  // @see http://redux.js.org/docs/api/bindActionCreators.html
  mapDispatch(actions: mapDispatchToProps): Actions {
    if (typeof actions === 'function') {
      return actions(store.dispatch);
    }

    return bindActionCreators(actions, store.dispatch);
  }

  // Nest subscriptions of descendant components, so that we can
  // ensure the ancestor components re-render before descendants.
  listeners = [];

  // Only top-level <Connect /> needs to subscribe to the store
  storeUnsubscribe: Function;

  // Cache mapDispatchToProps, re-compute only when props change
  actions: Actions = {
    dispatch: store.dispatch,
    ...(this.props.actions && this.mapDispatch(this.props.actions)),
  };

  // Compute initial state
  state = this.props.state(store.getState());

  componentWillMount() {
    if (this.context.connectParent === undefined) {
      // This is a top-level Connect, subscribe to the store directly
      this.storeUnsubscribe = store.subscribe(this.storeListener);
    } else {
      // This is a descendant Connect, subscribe to its parent
      this.context.connectParent.subscribe(this.storeListener);
    }
  }

  componentWillUnmount() {
    if (this.context.connectParent === undefined) {
      this.storeUnsubscribe();
    } else {
      this.context.connectParent.unsubscribe(this.storeListener);
    }
  }

  shouldComponentUpdate(nextProps: Props<*>, nextState: *) {
    // Shallow comparison of props & state, make sure your store is immutable
    const isEqual = shallowEqual(this.props, nextProps) && shallowEqual(this.state, nextState);

    // When true the descendants will have the chance to run their own sCU and re-render,
    // so call their listeners only sCU returns false
    if (isEqual) {
      this.notify();
    }

    return !isEqual;
  }

  componentWillReceiveProps(nextProps: Props<*>) {
    this.actions = {
      dispatch: store.dispatch,
      ...(nextProps.actions && this.mapDispatch(nextProps.actions)),
    };
    this.setState(nextProps.state(store.getState()));
  }

  subscribe(listener: typeof Connect.prototype.storeListener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: typeof Connect.prototype.storeListener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  }

  notify() {
    this.listeners.forEach(listener => {
      listener();
    });
  }

  render() {
    if (this.props.render !== undefined) {
      // render prop, takes precedence
      return this.props.render(this.state, this.actions);
    } else if (this.props.children !== undefined) {
      // function-as-children
      return this.props.children(this.state, this.actions);
    }
    return null;
  }
}
