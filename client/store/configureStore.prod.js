import { createStore, compose } from 'redux'
import {createResponsiveStoreEnhancer} from 'redux-responsive'
import rootReducer from './rootReducer'

const configureStore = () => createStore(
  rootReducer,
  compose(
    createResponsiveStoreEnhancer({calculateStateInitially: false, performanceMode: true}),
  )

);

export default configureStore
