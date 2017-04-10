import React from 'react';
import { object } from 'prop-types';

const subscribe = Component =>
  class SubscribedCompoment extends React.Component {
    static contextTypes = {
      store: object,
    };

    static injected = false;
    // mounted = false;

    state = {
      subscribed: false,
    };

    // reload = (scope, reducer) => {
    //   if (this.mounted) {
    //     this.context.store.injectReducer(scope, reducer);
    //   }
    // };

    componentDidMount() {
      // this.mounted = true;
      const store = this.context.store;

      if (Component.reducers !== undefined && !SubscribedCompoment.injected) {
        for (let [scope, reducer] of Object.entries(Component.reducers)) {
          store.asyncReducers[scope] = reducer;
        }
        store.injectReducer();
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
      // this.mounted = false;
      // const store = this.context.store;

      if (Component.sagas !== undefined) {
        for (let saga of this.sagas) {
          if (saga.isRunning()) {
            saga.cancel();
          }
        }
      }

      // if (Component.reducers) {
      //   for (let scope of Object.keys(Component.reducers)) {
      //     store.ejectReducer(scope);
      //   }
      // }
    }

    render() {
      return this.state.subscribed ? <Component {...this.props} /*reload={this.reload}*/ /> : null;
    }
  };

export default subscribe;
