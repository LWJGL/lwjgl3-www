// @flow
import config from './config';
import { BUILD_RELEASE, BUILD_STABLE, MODE_ZIP, MODE_MAVEN, MODE_IVY } from './constants';
import type {
  BUILD_TYPES,
  NATIVES,
  MODES,
  Build,
  BuildConfig,
  BuildConfigStored,
  BuildStatus,
  BuildStatusSuccess,
  BuildStatusError,
} from './types';

// Actions

export const BUILD_STATUS = 'BUILD/STATUS';

export const SELECT_TYPE = 'BUILD/SELECT_TYPE';
export const SELECT_MODE = 'BUILD/SELECT_MODE';
export const SELECT_PRESET = 'BUILD/SELECT_PRESET';
export const SELECT_LANGUAGE = 'BUILD/SELECT_LANGUAGE';
export const SELECT_VERSION = 'BUILD/SELECT_VERSION';
export const TOGGLE_DESCRIPTIONS = 'BUILD/TOGGLE_DESCRIPTIONS';
export const TOGGLE_SOURCE = 'BUILD/TOGGLE_SOURCE';
export const TOGGLE_JAVADOC = 'BUILD/TOGGLE_JAVADOC';
export const TOGGLE_OSGI = 'BUILD/TOGGLE_OSGI';
export const TOGGLE_COMPACT = 'BUILD/TOGGLE_COMPACT';
export const TOGGLE_HARDCODED = 'BUILD/TOGGLE_HARDCODED';
export const TOGGLE_PLATFORM = 'BUILD/TOGGLE_PLATFORM';
export const TOGGLE_ARTIFACT = 'BUILD/TOGGLE_ARTIFACT';
export const TOGGLE_ADDON = 'BUILD/TOGGLE_ADDON';

export const DOWNLOAD_INIT = 'BUILD/DOWNLOAD_INIT';
export const DOWNLOAD_CANCEL = 'BUILD/DOWNLOAD_CANCEL';
export const DOWNLOAD_COMPLETE = 'BUILD/DOWNLOAD_COMPLETE';
export const DOWNLOAD_LOG = 'BUILD/DOWNLOAD_LOG';

export const CONFIG_LOAD = 'BUILD/CONFIG_LOAD';
export const CONFIG_DOWNLOAD = 'BUILD/CONFIG_DOWNLOAD';

export const RESET = 'BUILD/RESET';

// Action Creators

export const changeType = (type: BUILD_TYPES | null) => ({ type: SELECT_TYPE, build: type });
export const changeMode = (mode: string) => ({ type: SELECT_MODE, mode });
export const changePreset = (preset: string) => ({ type: SELECT_PRESET, preset });
export const changeLanguage = (language: string) => ({ type: SELECT_LANGUAGE, language });
export const changeVersion = (version: string) => ({ type: SELECT_VERSION, version });

export const toggleDescriptions = (enabled: boolean) => ({ type: TOGGLE_DESCRIPTIONS, descriptions: enabled });
export const toggleSource = (enabled: boolean) => ({ type: TOGGLE_SOURCE, source: enabled });
export const toggleJavadoc = (enabled: boolean) => ({ type: TOGGLE_JAVADOC, javadoc: enabled });
export const toggleOSGi = (enabled: boolean) => ({ type: TOGGLE_OSGI, osgi: enabled });
export const toggleCompact = (enabled: boolean) => ({ type: TOGGLE_COMPACT, compact: enabled });
export const toggleHardcoded = (enabled: boolean) => ({ type: TOGGLE_HARDCODED, hardcoded: enabled });
export const toggleArtifact = (artifact: string) => ({ type: TOGGLE_ARTIFACT, artifact });
export const togglePlatform = (platform: string) => ({ type: TOGGLE_PLATFORM, platform });
export const toggleAddon = (addon: string) => ({ type: TOGGLE_ADDON, addon });

export const downloadInit = () => ({ type: DOWNLOAD_INIT });
export const downloadCancel = () => ({ type: DOWNLOAD_CANCEL });
export const downloadComplete = (error?: string) => ({ type: DOWNLOAD_COMPLETE, error });
export const downloadLog = (message: string) => ({ type: DOWNLOAD_LOG, message });

export const configLoad = (payload: {}) => ({ type: CONFIG_LOAD, payload });
export const configDownload = () => ({ type: CONFIG_DOWNLOAD });

export const reset = () => ({ type: RESET });

export const storeStatus = (name: BUILD_TYPES, response: BuildStatus) => {
  if (response.error) {
    const payload: BuildStatusError = {
      error: response.error,
    };
    return { type: BUILD_STATUS, name, payload };
  } else if (response.lastModified) {
    const payload: BuildStatusSuccess = {
      lastModified: response.lastModified,
    };
    if (response.version !== undefined) {
      payload.version = response.version.replace(/^LWJGL\s+/, '');
    }
    return { type: BUILD_STATUS, name, payload };
  }

  return { type: BUILD_STATUS, name, payload: { error: 'Unknown' } };
};

type Action =
  | ExtractReturn<typeof storeStatus>
  | ExtractReturn<typeof changeType>
  | ExtractReturn<typeof changeMode>
  | ExtractReturn<typeof changePreset>
  | ExtractReturn<typeof changeLanguage>
  | ExtractReturn<typeof changeVersion>
  | ExtractReturn<typeof toggleDescriptions>
  | ExtractReturn<typeof toggleSource>
  | ExtractReturn<typeof toggleJavadoc>
  | ExtractReturn<typeof toggleOSGi>
  | ExtractReturn<typeof toggleCompact>
  | ExtractReturn<typeof toggleHardcoded>
  | ExtractReturn<typeof toggleArtifact>
  | ExtractReturn<typeof togglePlatform>
  | ExtractReturn<typeof toggleAddon>
  | ExtractReturn<typeof downloadInit>
  | ExtractReturn<typeof downloadCancel>
  | ExtractReturn<typeof downloadComplete>
  | ExtractReturn<typeof downloadLog>
  | ExtractReturn<typeof configLoad>
  | ExtractReturn<typeof configDownload>
  | ExtractReturn<typeof reset>;

async function fetchStatus(url: string) {
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export const loadStatus = (name: BUILD_TYPES) => async (dispatch: Function, getState: () => any) => {
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

// Reducer

export default function buildConfiguratorReducer(state: BuildConfig = config, action: Action) {
  switch (action.type) {
    case BUILD_STATUS:
      return saveStatus({ ...state }, action.name, action.payload);

    case SELECT_TYPE:
      if (state.downloading === false) {
        return selectBuild({ ...state }, action.build !== state.build ? action.build : null);
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

    case TOGGLE_OSGI:
      if (state.mode !== MODE_ZIP && state.build === BUILD_RELEASE) {
        return { ...state, osgi: action.osgi };
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
      if (action.error !== undefined) {
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

const computeArtifacts = (state: BuildConfig) => {
  if (state.build === null) {
    return;
  }
  state.artifacts = state.lwjgl[state.build === BUILD_RELEASE && state.version !== null ? state.version : state.build];
  state.availability = {};
  state.artifacts.allIds.forEach(it => {
    const artifact = state.artifacts.byId[it];

    state.availability[it] =
      state.mode !== MODE_ZIP ||
      artifact.natives === undefined ||
      artifact.natives.length === config.natives.allIds.length ||
      artifact.natives.some((platform: NATIVES) => !!state.platform[platform]);
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

const selectBuild = (state: BuildConfig, build: BUILD_TYPES | null) => {
  state.build = build;
  if (build !== null) {
    computeArtifacts(state);
  }

  return state;
};

const selectVersion = (state: BuildConfig, version: string) => {
  state.version = version;
  computeArtifacts(state);
  return state;
};

const selectMode = (state: BuildConfig, mode: MODES) => {
  state.mode = mode;
  computeArtifacts(state);
  return state;
};

const selectPreset = (state: BuildConfig, preset: string) => {
  // Make sure preset exists
  if (state.presets.byId[preset] === undefined) {
    return;
  }

  // Set preset
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
    if (state.presets.byId[preset].artifacts !== undefined) {
      state.presets.byId[preset].artifacts.forEach(artifact => {
        state.contents[artifact] = true;
      });
    }
  }

  return state;
};

const doToggleArtifact = (state: BuildConfig, artifact: string) => {
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
  const presetFoundMatch = state.presets.allIds.some((preset: string) => {
    // only check predefined presets
    if (preset === 'custom' || preset === 'all' || preset === 'none') {
      return false;
    }

    // Get preset artifacts but keep only ones present in the current artifact collection
    if (state.presets.byId[preset].artifacts) {
      const artifacts = state.presets.byId[preset].artifacts.filter(it => !!state.artifacts.byId[it]);

      // first check length for speed, then do deep comparison
      if (artifacts.length === selected.length && artifacts.every((it, i) => it === selected[i])) {
        state.preset = preset;
        return true;
      }
    }

    return false;
  });

  // if we didn't get a match, set it to custom preset
  if (!presetFoundMatch) {
    state.preset = 'custom';
  }

  return state;
};

const doToggleAddon = (state: BuildConfig, addon: string) => {
  if (state.selectedAddons.includes(addon)) {
    state.selectedAddons = state.selectedAddons.filter(it => it !== addon);
  } else {
    state.selectedAddons = [...state.selectedAddons, addon];
  }

  return state;
};

const loadConfig = (state: BuildConfig, config: BuildConfigStored) => {
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
  state.osgi = !!config.osgi;

  if (config.build === BUILD_RELEASE && config.version && config.versionLatest) {
    if (config.versionLatest === state.versions[1]) {
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
  } else if (config.contents !== undefined) {
    state.preset = 'custom';
    state.contents = {};
    if (Array.isArray(config.contents)) {
      config.contents.forEach((binding: string) => {
        if (state.artifacts.byId[binding]) {
          state.contents[binding] = true;
        }
      });
    }
  } else {
    selectPreset(state, 'getting-started');
  }

  return state;
};

const saveStatus = (state: BuildConfig, name: BUILD_TYPES, payload: BuildStatus) => {
  state.builds.byId[name].status = payload;
  return state;
};
