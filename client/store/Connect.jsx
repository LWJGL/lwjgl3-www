// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useContext, useRef } from 'react';
import { bindActionCreators, type ActionCreators, type Dispatch } from 'redux';
import { store } from './';
import { StoreContext } from './Provider';
import shallowEqual from 'fbjs/lib/shallowEqual';
// import memoize from 'memoize-state';

// Wraps action creators with dispatch
// A. Supports passing a function, first argument is the store's dispatch
// B. Supports passing an object whose values are action creators
// @see https://redux.js.org/api/bindactioncreators

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

export function Connect(props: Props) {
  const store = useContext(StoreContext);
  const actions = useRef({
    dispatch: store.dispatch,
    ...(props.actions && mapDispatch(props.actions)),
  });
  const state = useRef(null);

  const nextState = props.state(store);
  if (!shallowEqual(state.current, nextState)) {
    state.current = nextState;
  }

  return (
    <Slice state={state.current} actions={actions.current}>
      {props.children}
    </Slice>
  );
}

type SliceProps = {
  state: any,
  actions: Actions,
  children: (state: any, actions: Actions) => React.Node,
};

const Slice = memo(
  (props: SliceProps) => props.children(props.state, props.actions),
  (prevProps: SliceProps, nextProps: SliceProps) => prevProps.state === nextProps.state
);
