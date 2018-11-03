import { createStore, compose, applyMiddleware } from 'redux';
import { createReducer } from './createReducer';
import reduxThunk from 'redux-thunk';
import { Store } from 'redux';

const middleware = [reduxThunk];

if (!FLAG_PRODUCTION && FLAG_REDUXLOGGER) {
  middleware.push(require('redux-logger').logger);
}

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store: Store = createStore(createReducer(), compose(applyMiddleware(...middleware)));

if (!FLAG_PRODUCTION) {
  // Enable Webpack hot module replacement for global reducers
  //@ts-ignore
  if (module.hot) {
    //@ts-ignore
    module.hot.accept('./createReducer', () => {
      store.replaceReducer(createReducer());
    });
  }
}
