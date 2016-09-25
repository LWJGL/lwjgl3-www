import {
  SELECT_TYPE,
  SELECT_MODE,
} from './actionTypes'

export default function buildConfigurator(state = {
  buildType: null,
  mode: 'zip',
}, action) {

  switch ( action.type ) {
    case SELECT_TYPE:
      return { ...state, buildType: action.buildType };
    case SELECT_MODE:
      return { ...state, mode: action.mode };
  }

  return state;
}
