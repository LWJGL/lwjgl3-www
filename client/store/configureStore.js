import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createReducer from './createReducer'
import breakpointMiddeware from './middleware/breakpoint'
import saga from './saga'

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware, breakpointMiddeware];
  const composed = [];

  if ( process.env.NODE_ENV !== 'production' ) {
    // https://github.com/evgenyrodionov/redux-logger
    const createLogger = require('redux-logger').default;

    middleware.push(
      createLogger({
        duration: true,
        // diff: true,
        collapsed: true,
      })
    );

    // https://github.com/zalmoxisus/redux-devtools-extension
    composed.push(window.devToolsExtension ? window.devToolsExtension() : (f) => f);
  }

  const store = createStore(
    createReducer(),
    compose(
      applyMiddleware(...middleware),
      ...composed
    )
  );

  store.asyncReducers = {};
  store.runSaga = sagaMiddleware.run;

  store.injectReducer = (name, asyncReducer) => {
    store.asyncReducers[name] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  store.ejectReducer = (name) => {
    // store.asyncReducers[name] = (state={}) => state;
    delete store.asyncReducers[name];
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  sagaMiddleware.run(saga);

  if ( process.env.NODE_ENV !== 'production' ) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./createReducer', () => {
      store.replaceReducer(createReducer())
    });
    // Enable Webpack hot module replacement for sagas
    // module.hot.accept('./saga', () => {
    //   sagaMiddleware.run(saga);
    // });
  }

  return store;
}

export default configureStore
