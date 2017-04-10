import React from 'react';
import PropTypes from 'prop-types';

const subscribe = Component =>
  class SubscribedCompoment extends React.Component {
    static contextTypes = {
      store: PropTypes.object,
    };

    static injected = false;

    state = {
      subscribed: false,
    };

    componentDidMount() {
      const store = this.context.store;
      const state = store.getState();
      let injected = 0;

      if (Component.reducers !== undefined && !SubscribedCompoment.injected) {
        for (let [scope, reducer] of Object.entries(Component.reducers)) {
          if (state[scope] === undefined) {
            injected += 1;
            store.asyncReducers[scope] = reducer;
          }
        }
        if (injected > 0) {
          store.injectReducer();
        }
        SubscribedCompoment.injected = true;
      }

      if (Component.sagas !== undefined) {
        this.sagas = [];
        for (let saga of Component.sagas) {
          this.sagas.push(
            // returns descriptor that we can use to cancel the saga
            store.runSaga(saga)
          );
        }
      }

      this.setState({ subscribed: true });
    }

    componentWillUnmount() {
      if (Component.sagas !== undefined) {
        for (let saga of this.sagas) {
          if (saga.isRunning()) {
            saga.cancel();
          }
        }
      }

      // const store = this.context.store;
      // if (Component.reducers) {
      //   for (let scope of Object.keys(Component.reducers)) {
      //     store.ejectReducer(scope);
      //   }
      // }
    }

    render() {
      return this.state.subscribed ? <Component {...this.props} /> : null;
    }
  };

export default subscribe;
