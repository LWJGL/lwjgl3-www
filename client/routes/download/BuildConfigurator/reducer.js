import config from './config';
import { BUILD_RELEASE, BUILD_STABLE, MODE_ZIP, MODE_MAVEN, MODE_IVY } from './constants';

// Types

type BuildStatusSuccess = {|
  lastModified: string,
  version?: string,
|};
type BuildStatusError = {| error: string |};
export type BuildStatus = BuildStatusSuccess | BuildStatusError;

type ActionBuildStatus = 'BUILD/STATUS';

type ActionStore = {
  type: ActionBuildStatus,
  name: string,
  payload: BuildStatus,
};

// TODO: Add definitions for all possible actions
type Action = ActionStore | any;

/*
type State = {
  [_: string]: Status,
};
*/

// Actions

export const BUILD_STATUS: ActionBuildStatus = 'BUILD/STATUS';

export const SELECT_TYPE = 'BUILD/SELECT_TYPE';
export const SELECT_MODE = 'BUILD/SELECT_MODE';
export const SELECT_PRESET = 'BUILD/SELECT_PRESET';
export const SELECT_LANGUAGE = 'BUILD/SELECT_LANGUAGE';
export const SELECT_VERSION = 'BUILD/SELECT_VERSION';
export const TOGGLE_DESCRIPTIONS = 'BUILD/TOGGLE_DESCRIPTIONS';
export const TOGGLE_SOURCE = 'BUILD/TOGGLE_SOURCE';
export const TOGGLE_JAVADOC = 'BUILD/TOGGLE_JAVADOC';
export const TOGGLE_COMPACT = 'BUILD/TOGGLE_COMPACT';
export const TOGGLE_HARDCODED = 'BUILD/TOGGLE_HARDCODED';
export const TOGGLE_PLATFORM = 'BUILD/TOGGLE_PLATFORM';
export const TOGGLE_ARTIFACT = 'BUILD/TOGGLE_ARTIFACT';
export const TOGGLE_ADDON = 'BUILD/TOGGLE_ADDON';

export const DOWNLOAD_INIT = 'BUILD/DOWNLOAD_INIT';
export const DOWNLOAD_COMPLETE = 'BUILD/DOWNLOAD_COMPLETE';
export const DOWNLOAD_LOG = 'BUILD/DOWNLOAD_LOG';

export const CONFIG_LOAD = 'BUILD/CONFIG_LOAD';
export const CONFIG_DOWNLOAD = 'BUILD/CONFIG_DOWNLOAD';

export const RESET = 'BUILD/RESET';

// Reducer

const nativeCnt = config.natives.allIds.length;

const computeArtifacts = state => {
  state.artifacts = state.lwjgl[state.build === BUILD_RELEASE ? state.version : state.build];
  state.availability = {};
  state.artifacts.allIds.forEach(it => {
    const artifact = state.artifacts.byId[it];

    state.availability[it] =
      state.mode !== MODE_ZIP ||
      artifact.natives === undefined ||
      artifact.natives.length === nativeCnt ||
      artifact.natives.some(platform => !!state.platform[platform]);
  });

  if (state.preset !== 'custom') {
    selectPreset(state, state.preset);
  }

  if (state.build === BUILD_STABLE) {
    if (state.mode !== MODE_ZIP) {
      state.mode = MODE_ZIP;
    }
  }

  return state;
};

const selectBuild = (state, build) => {
  state.build = build;
  if (build !== null) {
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

  if (preset === 'all') {
    state.contents = { ...state.contents };
    state.artifacts.allIds.forEach(artifact => {
      state.contents[artifact] = true;
    });
  } else if (preset !== 'custom') {
    state.contents = { ...state.contents };
    state.artifacts.allIds.forEach(artifact => {
      state.contents[artifact] = false;
    });
    state.presets.byId[preset].artifacts.forEach(artifact => {
      state.contents[artifact] = true;
    });
  }

  return state;
};

const doToggleArtifact = (state, artifact) => {
  state.contents = { ...state.contents, [artifact]: !state.contents[artifact] };

  // MATCH PRESET
  // collect selected artifacts in an Array
  const selected = state.artifacts.allIds.filter(artifact => state.contents[artifact]);

  if (selected.length === state.artifacts.allIds.length) {
    state.preset = 'all';
    return state;
  } else if (selected.length === 1) {
    state.preset = 'none';
    return state;
  }

  // match selected artifacts with a preset
  const presetFoundMatch = state.presets.allIds.some(preset => {
    // only check predefined presets
    if (preset === 'custom' || preset === 'all' || preset === 'none') {
      return false;
    }

    // Get preset artifacts but keep only ones present in the current artifact collection
    const artifacts = state.presets.byId[preset].artifacts.filter(it => !!state.artifacts.byId[it]);

    // first check length for speed, then do deep comparison
    if (artifacts.length === selected.length && artifacts.every((it, i) => it === selected[i])) {
      state.preset = preset;
      return true;
    }

    return false;
  });

  // if we didn't get a match, set it to custom preset
  if (!presetFoundMatch) {
    state.preset = 'custom';
  }

  return state;
};

const doToggleAddon = (state, addon) => {
  if (state.selectedAddons.includes(addon)) {
    state.selectedAddons = state.selectedAddons.filter(it => it !== addon);
  } else {
    state.selectedAddons = [...state.selectedAddons, addon];
  }

  return state;
};

const loadConfig = (state, config) => {
  if (config.build === null) {
    return state;
  }

  state.build = config.build;
  state.mode = config.mode;
  state.selectedAddons = config.selectedAddons;
  state.descriptions = config.descriptions;
  state.compact = config.compact;
  state.hardcoded = config.hardcoded;
  state.javadoc = config.javadoc;
  state.source = config.source;
  state.language = config.language;

  if (config.build === BUILD_RELEASE) {
    if (!config.versionLatest || config.versionLatest === state.versions[1]) {
      state.version = state.versions[0];
    } else {
      state.version = config.version;
    }
  }

  if (config.mode === MODE_ZIP) {
    state.natives.allIds.forEach(platform => {
      state.platform[platform] = false;
    });
    config.platform.forEach(platform => {
      state.platform[platform] = true;
    });
  }

  computeArtifacts(state);

  if (config.preset) {
    selectPreset(state, config.preset);
  } else {
    state.preset = 'custom';
    state.contents = {};
    config.contents.forEach(binding => {
      if (state.artifacts.byId[binding]) {
        state.contents[binding] = true;
      }
    });
  }

  return state;
};

const saveStatus = (state, name, payload) => {
  state.builds.byId[name].status = payload;
  return state;
};

export default function buildConfiguratorReducer(state: {} = config, action: Action) {
  switch (action.type) {
    case BUILD_STATUS:
      return saveStatus({ ...state }, action.name, action.payload);

    case SELECT_TYPE:
      if (action.build !== state.build && state.downloading === false) {
        return selectBuild({ ...state }, action.build);
      }
      break;

    case SELECT_MODE:
      if (state.build !== BUILD_STABLE && state.mode !== action.mode) {
        return selectMode({ ...state }, action.mode);
      }
      break;

    case TOGGLE_DESCRIPTIONS:
      return { ...state, descriptions: action.descriptions };

    case TOGGLE_COMPACT:
      if (state.mode === MODE_MAVEN || state.mode === MODE_IVY) {
        return { ...state, compact: action.compact };
      }
      break;

    case TOGGLE_HARDCODED:
      if (state.mode !== MODE_ZIP) {
        return { ...state, hardcoded: action.hardcoded };
      }
      break;

    case TOGGLE_JAVADOC:
      if (state.mode === MODE_ZIP) {
        return { ...state, javadoc: action.javadoc };
      }
      break;

    case TOGGLE_SOURCE:
      if (state.mode === MODE_ZIP) {
        return { ...state, source: action.source };
      }
      break;

    case SELECT_PRESET:
      if (state.preset !== action.preset) {
        return selectPreset({ ...state }, action.preset);
      }
      break;

    case SELECT_LANGUAGE:
      // not implemented
      break;

    case TOGGLE_PLATFORM:
      if (state.mode === MODE_ZIP) {
        const selections = state.natives.allIds.reduce(
          (previousValue, platform) => previousValue + (state.platform[platform] ? 1 : 0),
          0
        );
        if (selections > 1 || state.platform[action.platform] === false) {
          return computeArtifacts({
            ...state,
            platform: { ...state.platform, [action.platform]: !state.platform[action.platform] },
          });
        }
      }
      break;

    case SELECT_VERSION:
      if (state.build === BUILD_RELEASE && state.version !== action.version) {
        return selectVersion({ ...state }, action.version);
      }
      break;

    case TOGGLE_ARTIFACT:
      if (action.artifact !== 'lwjgl') {
        return doToggleArtifact({ ...state }, action.artifact);
      }
      break;

    case TOGGLE_ADDON:
      return doToggleAddon({ ...state }, action.addon);

    case DOWNLOAD_INIT:
      if (state.mode === MODE_ZIP && state.downloading === false) {
        return { ...state, downloading: true, progress: [] };
      }
      break;

    case DOWNLOAD_LOG:
      return { ...state, progress: [...state.progress, action.message] };

    case DOWNLOAD_COMPLETE:
      if (action.error) {
        alert(action.error);
      }
      return { ...state, downloading: false };

    case RESET:
      if (state.downloading) {
        // TODO: Cancel fetch when browsers start supporting it
        return { ...state, downloading: false };
      }
      break;

    case CONFIG_LOAD:
      return loadConfig({ ...state }, action.payload);
  }

  return state;
}

// Action Creators

export const changeType = (type: string) => ({ type: SELECT_TYPE, build: type });
export const changeMode = (mode: string) => ({ type: SELECT_MODE, mode });
export const changePreset = (preset: string) => ({ type: SELECT_PRESET, preset });
export const changeLanguage = (language: string) => ({ type: SELECT_LANGUAGE, language });
export const changeVersion = (version: string) => ({ type: SELECT_VERSION, version });

export const toggleDescriptions = (enabled: boolean) => ({ type: TOGGLE_DESCRIPTIONS, descriptions: enabled });
export const toggleSource = (enabled: boolean) => ({ type: TOGGLE_SOURCE, source: enabled });
export const toggleJavadoc = (enabled: boolean) => ({ type: TOGGLE_JAVADOC, javadoc: enabled });
export const toggleCompact = (enabled: boolean) => ({ type: TOGGLE_COMPACT, compact: enabled });
export const toggleHardcoded = (enabled: boolean) => ({ type: TOGGLE_HARDCODED, hardcoded: enabled });
export const toggleArtifact = (artifact: string) => ({ type: TOGGLE_ARTIFACT, artifact });
export const togglePlatform = (platform: string) => ({ type: TOGGLE_PLATFORM, platform });
export const toggleAddon = (addon: string) => ({ type: TOGGLE_ADDON, addon });

export const downloadInit = () => ({ type: DOWNLOAD_INIT });
export const downloadComplete = (error: string) => ({ type: DOWNLOAD_COMPLETE, error });
export const downloadLog = (message: string) => ({ type: DOWNLOAD_LOG, message });

export const configLoad = (payload: {}) => ({ type: CONFIG_LOAD, payload });
export const configDownload = () => ({ type: CONFIG_DOWNLOAD });

export const reset = () => ({ type: RESET });

export const storeStatus = (name: string, payload: BuildStatus): ActionStore => {
  if (payload.error === undefined && payload.version !== undefined) {
    payload.version = payload.version.replace(/^LWJGL\s+/, '');
  }
  return { type: BUILD_STATUS, name, payload };
};

async function fetchStatus(url: string) {
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export const loadStatus = (name: string) => async (dispatch: Function, getState: () => any) => {
  let result;
  let url = `/build/${name}`;

  if (name === 'release') {
    url += `/${getState().build.versions[0]}`;
  }

  try {
    result = await fetchStatus(url);
  } catch (err) {
    result = { error: err.message };
  }

  dispatch(storeStatus(name, result));
};
