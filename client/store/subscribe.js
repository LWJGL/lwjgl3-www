import React from 'react';
import PropTypes from 'prop-types';

const subscribe = Component =>
  class extends React.Component {
    static contextTypes = {
      store: PropTypes.object,
    };

    mounted = false;

    state = {
      subscribed: false,
    };

    reload = (scope, reducer) => {
      if (this.mounted) {
        this.context.store.injectReducer(scope, reducer);
      }
    };

    componentDidMount() {
      this.mounted = true;
      const store = this.context.store;

      if (Component.reducers) {
        for (let [scope, reducer] of Object.entries(Component.reducers)) {
          store.injectReducer(scope, reducer);
        }
      }

      if (Component.sagas) {
        this.sagas = [];
        for (let saga of Component.sagas) {
          this.sagas.push(store.runSaga(saga));
        }
      }

      this.setState({ subscribed: true });
    }

    componentWillUnmount() {
      this.mounted = false;
      const store = this.context.store;

      if (this.sagas) {
        for (let saga of this.sagas) {
          if (saga.isRunning()) {
            saga.cancel();
          }
        }
      }

      if (Component.reducers) {
        for (let scope of Object.keys(Component.reducers)) {
          store.ejectReducer(scope);
        }
      }
    }

    render() {
      return this.state.subscribed ? <Component {...this.props} reload={this.reload} /> : null;
    }
  };

export default subscribe;
