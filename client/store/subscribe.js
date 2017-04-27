import React from 'react';
import PropTypes from 'prop-types';
import type { Task } from 'redux-saga';
import { sagaMiddleware } from './saga';
import createReducer from './createReducer';
import asyncReducers from './asyncReducers';

type State = {
  subscribed: boolean,
};

export default function subscribe(Component: Class<React$Component<*, *, *>>) {
  return class SubscribedCompoment extends React.Component<void, void, State> {
    static contextTypes = {
      store: PropTypes.object,
    };

    static injected = false;
    sagas: Array<Task> = [];

    state = {
      subscribed: false,
    };

    componentDidMount() {
      const store = this.context.store;
      const state = store.getState();
      let injected = 0;

      if (Component.reducers !== undefined && !SubscribedCompoment.injected) {
        // $FlowFixMe
        for (let [scope, reducer] of Object.entries(Component.reducers)) {
          if (state[scope] === undefined) {
            injected += 1;
            asyncReducers[scope] = reducer;
          }
        }
        if (injected > 0) {
          store.replaceReducer(createReducer(asyncReducers));
        }
        SubscribedCompoment.injected = true;
      }

      if (Component.sagas !== undefined) {
        // Store task descriptor so we can cancel the saga onUnnount
        // $FlowFixMe
        this.sagas = Component.sagas.map(saga => sagaMiddleware.run(saga));
      }

      this.setState({ subscribed: true });
    }

    componentWillUnmount() {
      if (this.sagas.length) {
        for (let saga of this.sagas) {
          if (saga.isRunning()) {
            saga.cancel();
          }
        }

        this.sagas = [];
      }
    }

    render() {
      return this.state.subscribed ? <Component {...this.props} /> : null;
    }
  };
}
