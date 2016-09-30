import * as $ from './actionTypes'
import config from './config'

import {
  BUILD_RELEASE,
  BUILD_STABLE,
  BUILD_NIGHTLY,
  NATIVE_MAC,
  NATIVE_WIN,
  NATIVE_LINUX,
  MODE_ZIP,
  MODE_MAVEN,
  MODE_GRADLE,
} from './constants'

// const getError = (state, message, severity = "danger") => ({...state, error: {message, severity,}});

export default function buildConfigurator(state = config, action) {
  const {type, ...data} = action;

  switch (type) {
    case $.SELECT_TYPE:
      return {...state, ...data};

    case $.SELECT_MODE:
      return {...state, ...data};

    case $.TOGGLE_DESCRIPTIONS:
      return {...state, ...data};

    case $.TOGGLE_COMPACT:
      return {...state, ...data};

    case $.TOGGLE_HARDCODED:
      return {...state, ...data};

    case $.TOGGLE_JAVADOC:
      if ( state.mode !== MODE_ZIP ) {
        // return getError(state, 'Javadoc not available');
        return state;
      }
      return {...state, ...data};

    case $.TOGGLE_SOURCE:
      return {...state, ...data};

    case $.ERROR_SET:
      return {...state, ...data};

    case $.SELECT_PRESET:
      return {...state, ...data};

    case $.SELECT_LANGUAGE:
      if ( data.language !== 'groovy' ) {
        // not implemented
        return state;
      }
      return {...state, ...data};

    case $.SELECT_PLATFORM:
      return {...state, ...data};

    case $.SELECT_VERSION:
      return {...state, ...data};

    case $.TOGGLE_ARTIFACT:
      if ( data.artifact === 'lwjgl' ) {
        return state;
      }
      return {...state, contents: { ...state.contents, [data.artifact]: true }};
  }

  return state;
}
