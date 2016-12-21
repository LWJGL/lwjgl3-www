import * as $ from './actionTypes'
import config from './config'

import {
  BUILD_RELEASE,
  BUILD_STABLE,
  MODE_ZIP,
  MODE_MAVEN,
  MODE_IVY,
} from './constants'

const nativeCnt = config.natives.allIds.length;

const computeArtifacts = (state) => {
  state.artifacts = state.lwjgl[state.build === BUILD_RELEASE ? state.version : state.build];

  state.availability = {};
  state.artifacts.allIds.forEach((it) => {
    const artifact = state.artifacts.byId[it];

    state.availability[it] =
      state.mode !== MODE_ZIP
      || artifact.natives === undefined
      || artifact.natives.length === nativeCnt
      || artifact.natives.some((platform) => !!state.platform[platform]);
  });

  if ( state.preset !== 'custom' ) {
    selectPreset(state, state.preset);
  }

  if ( state.build === BUILD_STABLE ) {
    if ( state.mode !== MODE_ZIP ) {
      state.mode = MODE_ZIP;
    }
  }

  return state;
};

const selectBuild = (state, build) => {
  state.build = build;
  if ( build !== null ) {
    computeArtifacts(state);
  }

  return state;
};

const selectVersion = (state, version) => {
  state.version = version;
  computeArtifacts(state);
  return state;
};

const selectMode = (state, mode) => {
  state.mode = mode;
  computeArtifacts(state);
  return state;
};

const selectPreset = (state, preset) => {
  state.preset = preset;

  if ( preset === 'all' ) {
    state.contents = {...state.contents};
    state.artifacts.allIds.forEach((artifact) => {
      state.contents[artifact] = true;
    });
  } else if ( preset !== 'custom' ) {
    state.contents = {...state.contents};
    state.artifacts.allIds.forEach((artifact) => {
      state.contents[artifact] = false;
    });
    state.presets.byId[preset].artifacts.forEach((artifact) => {
      state.contents[artifact] = true;
    });
  }

  return state;
};

const toggleArtifact = (state, artifact) => {
  state.contents = {...state.contents, [artifact]: !state.contents[artifact]};

  // MATCH PRESET
  // collect selected artifacts in an Array
  const selected = state.artifacts.allIds.filter((artifact) => state.contents[artifact]);

  if ( selected.length === state.artifacts.allIds.length ) {
    state.preset = 'all';
    return state;
  } else if ( selected.length === 1 ) {
    state.preset = 'none';
    return state;
  }

  // match selected artifacts with a preset
  const presetFoundMatch = state.presets.allIds.some((preset) => {
    // only check predefined presets
    if ( preset === 'custom' || preset === 'all' || preset === 'none' ) {
      return false;
    }

    // Get preset artifacts but keep only ones present in the current artifact collection
    const artifacts = state.presets.byId[preset].artifacts.filter((it) => !!state.artifacts.byId[it]);

    // first check length for speed, then do deep comparison
    if ( artifacts.length === selected.length && artifacts.every((it, i) => it === selected[i]) ) {
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

const toggleAddon = (state, addon) => {
  if ( state.selectedAddons.includes(addon) ) {
    state.selectedAddons = state.selectedAddons.filter((it) => it !== addon);
  } else {
    state.selectedAddons = [...state.selectedAddons, addon];
  }

  return state;
};

const loadConfig = (state, config) => {
  state.build = config.build;
  state.mode = config.mode;
  state.selectedAddons = config.selectedAddons;
  state.descriptions = config.descriptions;
  state.compact = config.compact;
  state.hardcoded = config.hardcoded;
  state.javadoc = config.javadoc;
  state.source = config.source;
  state.language = config.language;

  if ( config.build === BUILD_RELEASE ) {
    state.version = config.version;
  }

  if ( config.mode === MODE_ZIP ) {
    state.natives.allIds.forEach((platform) => {
      state.platform[platform] = false;
    });
    config.platform.forEach((platform) => {
      state.platform[platform] = true;
    });
  }

  computeArtifacts(state);

  if ( config.preset ) {
    selectPreset(state, config.preset);
  } else {
    state.preset = 'custom';
    state.contents = {};
    config.contents.forEach((binding) => {
      if ( state.artifacts.byId[binding] ) {
        state.contents[binding] = true;
      }
    });
  }

   return state;
};

export default function(state = config, action) {

  switch (action.type) {

    case $.SELECT_TYPE:
      if ( action.build !== state.build && state.downloading === false ) {
        return selectBuild({...state}, action.build);
      }
      break;

    case $.SELECT_MODE:
      if ( state.build !== BUILD_STABLE && state.mode !== action.mode ) {
        return selectMode({...state}, action.mode);
      }
      break;

    case $.TOGGLE_DESCRIPTIONS:
      return {...state, descriptions: action.descriptions};

    case $.TOGGLE_COMPACT:
      if ( state.mode === MODE_MAVEN || state.mode === MODE_IVY ) {
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

    case $.TOGGLE_PLATFORM:
      if ( state.mode === MODE_ZIP ) {
        const selections = state.natives.allIds.reduce((previousValue, platform) => previousValue + (state.platform[platform] ? 1 : 0), 0);
        if ( selections > 1 || state.platform[action.platform] === false ) {
          return computeArtifacts({...state, platform: {...state.platform, [action.platform]: !state.platform[action.platform]}});
        }
      }
      break;

    case $.SELECT_VERSION:
      if ( state.build === BUILD_RELEASE && state.version !== action.version ) {
        return selectVersion({...state}, action.version);
      }
      break;

    case $.TOGGLE_ARTIFACT:
      if ( action.artifact !== 'lwjgl' ) {
        return toggleArtifact({...state}, action.artifact);
      }
      break;

    case $.TOGGLE_ADDON:
      return toggleAddon({...state}, action.addon);

    case $.DOWNLOAD_INIT:
      if ( state.mode === MODE_ZIP && state.downloading === false ) {
        return {...state, downloading: true, progress: []}
      }
      break;

    case $.DOWNLOAD_LOG:
      return {...state, progress: [...state.progress, action.payload]};

    case $.DOWNLOAD_COMPLETE:
      if ( action.error ) {
        alert(action.error);
      }
      return {...state, downloading: false};

    case $.RESET:
      if ( state.downloading ) {
        return {...state, downloading: false};
      }
      break;

    case $.CONFIG_LOAD:
      return loadConfig({...state}, action.payload);

  }

  return state;
}
