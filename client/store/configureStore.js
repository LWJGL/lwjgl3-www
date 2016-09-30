import { createStore } from 'redux'
import rootReducer from './rootReducer'

const configureStore = initialState => createStore(
  rootReducer,
  process.browser && process.env.NODE_ENV !== 'production' && window.devToolsExtension && window.devToolsExtension()
);

export default configureStore
