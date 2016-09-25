import { combineReducers } from 'redux'
import {createResponsiveStateReducer} from 'redux-responsive'
import build from '../containers/build/reducer'

const rootReducer = combineReducers({
  build,
  browser: createResponsiveStateReducer({
    xs: 544,
    sm: 768,
    md: 992,
    lg: 1200,
    // xs: 0,
    // sm: 544,
    // md: 768,
    // lg: 992,
    // xl: 1200,
  }),
});

export default rootReducer
