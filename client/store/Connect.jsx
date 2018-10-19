// @flow
import * as React from 'react';
import { bindActionCreators, type ActionCreators, type Dispatch } from 'redux';
import { store } from './';
import { StoreContext } from './Provider';
import shallowEqual from 'fbjs/lib/shallowEqual';
// import memoize from 'memoize-state';

function readContext(Context, observedBits) {
  //$FlowFixMe
  const dispatcher = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.currentDispatcher;
  return dispatcher.readContext(Context, observedBits);
}

// Wraps action creators with dispatch
// A. Supports passing a function, first argument is the store's dispatch
// B. Supports passing an object whose values are action creators
// @see http://redux.js.org/docs/api/bindActionCreators.html

type mapDispatchToProps = ActionCreators<any, any> | ((dispatch: Dispatch<any>) => Actions);

function mapDispatch(actions: mapDispatchToProps): Actions {
  if (typeof actions === 'function') {
    return actions(store.dispatch);
  }

  return bindActionCreators(actions, store.dispatch);
}

type Actions = {
  dispatch: Dispatch<any>,
  [string]: <A, B>(...args: Array<A>) => B,
};

type Selector = (store: any) => any;

type Props = {
  state: Selector,
  actions?: mapDispatchToProps,
  children: (state: any, actions: Actions) => React.Node,
};

export class Connect extends React.Component<Props, Object> {
  static contextType = StoreContext;

  actions: Actions = {
    dispatch: store.dispatch,
    ...(this.props.actions && mapDispatch(this.props.actions)),
  };

  state = {};

  static getDerivedStateFromProps(nextProps: Props, prevState: any) {
    const sliceState = nextProps.state(readContext(StoreContext));
    return shallowEqual(prevState, sliceState) ? null : sliceState;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Slice state={this.state} actions={this.actions}>
        {this.props.children}
      </Slice>
    );
  }
}

type SliceProps = {
  state: any,
  actions: Actions,
  children: (state: any, actions: Actions) => React.Node,
};

function RenderSlice(props: SliceProps) {
  return props.children(props.state, props.actions);
}

function arePropsEqual(prevProps: SliceProps, nextProps: SliceProps) {
  return prevProps.state === nextProps.state;
}

//$FlowFixMe
const Slice = React.pure(RenderSlice, arePropsEqual);
