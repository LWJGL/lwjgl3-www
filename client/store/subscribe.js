import React from 'react'

const subscribe = (Component) => class extends React.Component {

  //noinspection JSUnusedGlobalSymbols
  static contextTypes = {
    store: React.PropTypes.object
  };

  mounted = false;

  state = {
    subscribed: false,
  };

  reload = (scope, reducer) => {
    if ( this.mounted ) {
      this.context.store.injectReducer(scope, reducer);
    }
  };

  componentDidMount() {
    this.mounted = true;
    const store = this.context.store;

    if ( Component.reducers ) {
      Object.keys(Component.reducers).forEach((scope) => {
        store.injectReducer(scope, Component.reducers[scope]);
      })
    }

    if ( Component.sagas ) {
      this.sagas = [];
      Component.sagas.forEach((saga) => {
        this.sagas.push(store.runSaga(saga));
      });
    }

    this.setState({subscribed: true});
  }

  componentWillUnmount() {
    this.mounted = false;
    const store = this.context.store;

    if ( this.sagas ) {
      this.sagas.forEach((saga) => {
        if ( saga.isRunning() ) {
          saga.cancel();
        }
      });
    }

    if ( Component.reducers ) {
      Object.keys(Component.reducers).forEach((scope) => {
        store.ejectReducer(scope);
      })
    }
  }

  render() {
    return this.state.subscribed ? <Component {...this.props} reload={this.reload} /> : null;
  }

};

export default subscribe
