import * as $ from './actionTypes'
import config from './config'

import {
  BUILD_RELEASE,
  BUILD_NIGHTLY,
  MODE_ZIP,
  MODE_MAVEN,
} from './constants'

// const getError = (state, message, severity = "danger") => ({...state, error: {message, severity,}});

const selectBuild = (state, build) => {
  state.build = build;
  if ( build !== null ) {
    state.version = state.builds.byId[build].latest.join('.');

    if ( build !== BUILD_NIGHTLY ) {
      selectMode(state, MODE_ZIP);
    }
  }

  return state;
};

const selectMode = (state, mode) => {
  state.mode = mode;
  if ( mode === MODE_ZIP && state.preset !== 'all' ) {
    selectPreset(state, 'all');
  }
  return state;
};

const selectPreset = (state, preset) => {
  state.preset = preset;

  if ( preset !== 'custom' ) {
    state.contents = {...state.contents};

    Object.keys(state.contents).forEach(artifact => {
      if ( artifact !== 'lwjgl' ) {
        state.contents[artifact] = false;
      }
    });

    state.presets.byId[preset].artifacts.forEach(artifact => {
      state.contents[artifact] = true;
    });
  }

  return state;
};

const toggleArtifact = (state, artifact, enabled) => {
  state.contents = {...state.contents, [artifact]: enabled};

  // MATCH PRESET
  // collect selected artifacts in an Array
  const selected = Object.keys(state.contents).filter(artifact => state.contents[artifact]);
  // match selected artifacts with a preset
  const presetFoundMatch = state.presets.allIds.some(preset => {
    // ignore custom preset
    if ( preset === 'custom' ) {
      return false;
    }
    const artifacts = state.presets.byId[preset].artifacts;
    // first check length for speed, then do deep comparison
    if ( artifacts.length === selected.length && artifacts.every((item, i) => item === selected[i]) ) {
      state.preset = preset;
      return true;
    }
    return false;
  });
  // if we didn't get a match, set it to custom preset
  if ( !presetFoundMatch ) {
    state.preset = 'custom';
  }

  return state;
};

export default function(state = config, action) {

  switch (action.type) {
    case $.SELECT_TYPE:
      if ( action.build !== state.build ) {
        return selectBuild({...state}, action.build);
      }
      break;

    case $.SELECT_MODE:
      if ( state.build === BUILD_NIGHTLY && state.mode !== action.mode ) {
        // For now, only allow nightly builds to select mode
        return selectMode({...state}, action.mode);
      }
      break;

    case $.TOGGLE_DESCRIPTIONS:
      return {...state, descriptions: action.descriptions};

    case $.TOGGLE_COMPACT:
      if ( state.mode === MODE_MAVEN ) {
        return {...state, compact: action.compact};
      }
      break;

    case $.TOGGLE_HARDCODED:
      if ( state.mode !== MODE_ZIP ) {
        return {...state, hardcoded: action.hardcoded};
      }
      break;

    case $.TOGGLE_JAVADOC:
      if ( state.mode === MODE_ZIP ) {
        return {...state, javadoc: action.javadoc};
      }
      break;

    case $.TOGGLE_SOURCE:
      if ( state.mode === MODE_ZIP ) {
        return {...state, source: action.source};
      }
      break;

    case $.SELECT_PRESET:
      if ( state.preset !== action.preset ) {
        return selectPreset({...state}, action.preset);
      }
      break;

    case $.SELECT_LANGUAGE:
      // not implemented
      break;
    // if ( state.language !== action.language) {
    //   return {...state, language: action.language};
    // }
    // break;

    case $.TOGGLE_PLATFORM:
      if ( state.mode === MODE_ZIP ) {
        const selections = state.natives.allIds.reduce((previousValue, platform) => previousValue + (state.platform[platform] ? 1 : 0), 0);
        if ( selections > 1 || state.platform[action.platform] === false ) {
          return {...state, platform: {...state.platform, [action.platform]: !state.platform[action.platform]}};
        }
      }
      break;

    case $.SELECT_VERSION:
      if ( state.build === BUILD_RELEASE ) {
        const latest = state.builds.byId[state.build].latest;
        const semver = state.versions.byId[action.version].semver;

        if ( semver[0] < latest[0] || semver[1] < latest[1] || semver[2] <= latest[2] ) {
          return {...state, version: action.version};
        }
      }
      break;

    case $.TOGGLE_ARTIFACT:
      if ( action.artifact !== 'lwjgl' ) {
        return toggleArtifact({...state}, action.artifact, action.enabled);
      }
      break;
  }

  return state;
}
