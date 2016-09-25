import { createStore } from 'redux'
import rootReducer from './rootReducer'

const configureStore = initialState => createStore(
  rootReducer
);

export default configureStore
