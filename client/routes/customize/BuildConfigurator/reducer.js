// @flow
import produce from 'immer';
import { register } from '~/store/asyncReducers';
import { config } from './config';
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

export const CONFIG_LOAD = 'BUILD/CONFIG_LOAD';

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

export const configLoad = (payload: {}) => ({ type: CONFIG_LOAD, payload });

export const storeStatus = (name: BUILD_TYPES, response: BuildStatus) => {
  if (response.error !== undefined) {
    const payload: BuildStatusError = {
      error: response.error,
    };
    return { type: BUILD_STATUS, name, payload };
  } else if (response.lastModified !== undefined) {
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
  | ExtractReturn<typeof configLoad>;

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

function buildConfiguratorReducer(state: BuildConfig = config, action: Action) {
  return produce(state, (draft: BuildConfig) => {
    switch (action.type) {
      case BUILD_STATUS:
        saveStatus(draft, action.name, action.payload);
        break;

      case SELECT_TYPE:
        selectBuild(draft, action.build !== state.build ? action.build : null);
        break;

      case SELECT_MODE:
        if (state.build !== BUILD_STABLE && state.mode !== action.mode) {
          selectMode(draft, action.mode);
        }
        break;

      case TOGGLE_DESCRIPTIONS:
        draft.descriptions = action.descriptions;
        break;

      case TOGGLE_COMPACT:
        if (state.mode === MODE_MAVEN || state.mode === MODE_IVY) {
          draft.compact = action.compact;
        }
        break;

      case TOGGLE_HARDCODED:
        if (state.mode !== MODE_ZIP) {
          draft.hardcoded = action.hardcoded;
        }
        break;

      case TOGGLE_JAVADOC:
        if (state.mode === MODE_ZIP) {
          draft.javadoc = action.javadoc;
        }
        break;

      case TOGGLE_SOURCE:
        if (state.mode === MODE_ZIP) {
          draft.source = action.source;
        }
        break;

      case TOGGLE_OSGI:
        if (state.mode !== MODE_ZIP && state.build === BUILD_RELEASE) {
          draft.osgi = action.osgi;
        }
        break;

      case SELECT_PRESET:
        if (state.preset !== action.preset) {
          selectPreset(draft, action.preset);
        }
        break;

      // case SELECT_LANGUAGE:
      //   break;

      case TOGGLE_PLATFORM:
        if (state.mode === MODE_ZIP) {
          const selections = state.natives.allIds.reduce(
            (previousValue, platform) => previousValue + (state.platform[platform] ? 1 : 0),
            0
          );
          if (selections > 1 || state.platform[action.platform] === false) {
            draft.platform[action.platform] = !state.platform[action.platform];
            computeArtifacts(draft);
          }
        }
        break;

      case SELECT_VERSION:
        if (state.build === BUILD_RELEASE && state.version !== action.version) {
          selectVersion(draft, action.version);
        }
        break;

      case TOGGLE_ARTIFACT:
        if (action.artifact !== 'lwjgl') {
          doToggleArtifact(draft, action.artifact);
        }
        break;

      case TOGGLE_ADDON:
        doToggleAddon(draft, action.addon);
        break;

      case CONFIG_LOAD:
        loadConfig(draft, action.payload);
        break;
    }
  });
}

const computeArtifacts = (state: BuildConfig) => {
  if (state.build === null) {
    return;
  }

  state.artifacts = state.lwjgl[state.build === BUILD_RELEASE && state.version !== null ? state.version : state.build];

  // reset state
  state.availability = {};
  state.presets.allIds.forEach(preset => {
    state.presets.byId[preset].artifacts = [];
  });

  state.artifacts.allIds.forEach(it => {
    const artifact = state.artifacts.byId[it];

    state.availability[it] =
      state.mode !== MODE_ZIP ||
      artifact.natives === undefined ||
      artifact.natives.length === config.natives.allIds.length ||
      artifact.natives.some((platform: NATIVES) => !!state.platform[platform]);

    if (state.availability[it] && artifact.presets !== undefined) {
      // Populate presets
      artifact.presets.forEach(preset => {
        // $FlowFixMe
        state.presets.byId[preset].artifacts.push(it);
      });
    }
  });

  if (state.preset !== 'custom') {
    selectPreset(state, state.preset);
  }

  if (state.build === BUILD_STABLE) {
    if (state.mode !== MODE_ZIP) {
      state.mode = MODE_ZIP;
    }
  }
};

const selectBuild = (state: BuildConfig, build: BUILD_TYPES | null) => {
  state.build = build;
  if (build !== null) {
    computeArtifacts(state);
  }
};

const selectVersion = (state: BuildConfig, version: string) => {
  state.version = version;
  computeArtifacts(state);
};

const selectMode = (state: BuildConfig, mode: MODES) => {
  state.mode = mode;
  computeArtifacts(state);
};

const selectPreset = (state: BuildConfig, preset: string) => {
  // Make sure preset exists
  if (state.presets.byId[preset] === undefined) {
    return;
  }

  // Set preset
  state.preset = preset;

  if (preset === 'all') {
    state.artifacts.allIds.forEach(artifact => {
      state.contents[artifact] = true;
    });
  } else if (preset !== 'custom') {
    state.artifacts.allIds.forEach(artifact => {
      state.contents[artifact] = false;
    });
    if (state.presets.byId[preset].artifacts !== undefined) {
      state.presets.byId[preset].artifacts.forEach(artifact => {
        state.contents[artifact] = true;
      });
    }
  }
};

const doToggleArtifact = (state: BuildConfig, artifact: string) => {
  state.contents[artifact] = !state.contents[artifact];

  // MATCH PRESET
  // collect selected artifacts in an Array
  const selected = state.artifacts.allIds.filter(artifact => state.contents[artifact]);

  if (selected.length === state.artifacts.allIds.length) {
    state.preset = 'all';
    return;
  } else if (selected.length === 1) {
    state.preset = 'none';
    return;
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
};

const doToggleAddon = (state: BuildConfig, addon: string) => {
  if (state.selectedAddons.includes(addon)) {
    state.selectedAddons = state.selectedAddons.filter(it => it !== addon);
  } else {
    state.selectedAddons.push(addon);
  }
};

const loadConfig = (state: BuildConfig, config: BuildConfigStored) => {
  if (config.build === null) {
    return;
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

  if (config.build === BUILD_RELEASE && config.version !== undefined && config.versionLatest !== undefined) {
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

  if (config.preset !== undefined) {
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
};

const saveStatus = (state: BuildConfig, name: BUILD_TYPES, payload: BuildStatus) => {
  state.builds.byId[name].status = payload;
};

// Self-register reducer on module load
register('build', buildConfiguratorReducer);
