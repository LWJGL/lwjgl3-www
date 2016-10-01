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

const selectBuild = (state, build) => {
  state.build = build;
  if ( build === BUILD_NIGHTLY ) {
    state.version = state.versions.allIds[0];
  } else {
    state.mode = MODE_ZIP;
    state.version = state.versions.allIds[1];
  }

  return state;
};

const toggleArtifact = (state, artifact) => {
  state.contents[artifact] = !state.contents[artifact];
  return state;
};

export default function buildConfigurator(state = config, action) {
  const {type, ...data} = action;

  switch (type) {
    case $.SELECT_TYPE:
      if ( data.build !== state.build ) {
        return selectBuild({...state}, data.build);
      }
      break;

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
      if ( data.artifact !== 'lwjgl' ) {
        return toggleArtifact({...state}, data.artifact);
      }
  }

  return state;
}
