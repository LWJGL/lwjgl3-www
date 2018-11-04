import * as React from 'react';
import produce from 'immer';
import { config } from './config';
import { ActionKeys, ActionTypes } from './actions';
import {
  BUILD_RELEASE,
  BUILD_STABLE,
  MODE_ZIP,
  // MODE_MAVEN, MODE_GRADLE, MODE_IVY
} from './constants';
import {
  BuildType,
  Native,
  // MODES,
  // LANGUAGES,
  BuildStore,
  BuildStoreSnapshot,
} from './types';

/*

// Action Creators
export const changeMode = (mode: MODES) => ({ type: SELECT_MODE, mode });
export const changePreset = (preset: string) => ({ type: SELECT_PRESET, preset });
export const changeLanguage = (language: LANGUAGES) => ({ type: SELECT_LANGUAGE, language });
export const changeVersion = (version: string) => ({ type: SELECT_VERSION, version });

export const toggleDescriptions = (enabled: boolean) => ({ type: TOGGLE_DESCRIPTIONS, descriptions: enabled });
export const toggleSource = (enabled: boolean) => ({ type: TOGGLE_SOURCE, source: enabled });
export const toggleJavadoc = (enabled: boolean) => ({ type: TOGGLE_JAVADOC, javadoc: enabled });
export const toggleIncludeJSON = (enabled: boolean) => ({ type: TOGGLE_INCLUDE_JSON, includeJSON: enabled });
export const toggleOSGi = (enabled: boolean) => ({ type: TOGGLE_OSGI, osgi: enabled });
export const toggleCompact = (enabled: boolean) => ({ type: TOGGLE_COMPACT, compact: enabled });
export const toggleHardcoded = (enabled: boolean) => ({ type: TOGGLE_HARDCODED, hardcoded: enabled });
export const toggleArtifact = (artifact: string) => ({ type: TOGGLE_ARTIFACT, artifact });
export const togglePlatform = (platform: NATIVES) => ({ type: TOGGLE_PLATFORM, platform });
export const toggleAddon = (addon: string) => ({ type: TOGGLE_ADDON, addon });

*/

// Reducer

export const reducer: React.Reducer<BuildStore, ActionTypes> = (state: BuildStore = config, action: ActionTypes) => {
  return produce(state, (draft: BuildStore) => {
    switch (action.type) {
      case ActionKeys.CONFIG_LOAD:
        loadConfig(draft, action.payload);
        break;
      case ActionKeys.SELECT_TYPE:
        selectBuild(draft, action.build !== state.build ? action.build : null);
        break;
      /*
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

      case TOGGLE_INCLUDE_JSON:
        if (state.mode === MODE_ZIP) {
          draft.includeJSON = action.includeJSON;
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

      case SELECT_LANGUAGE:
        if (state.mode === MODE_GRADLE) {
          draft.language = action.language;
        }
        break;

      case TOGGLE_PLATFORM:
        const selections = state.natives.allIds.reduce(
          (previousValue, platform) => previousValue + (state.platform[platform] ? 1 : 0),
          0
        );
        if (selections > 1 || state.platform[action.platform] === false) {
          draft.platform[action.platform] = !state.platform[action.platform];
          computeArtifacts(draft);
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

        */
    }
  });
};

function selectBuild(state: BuildStore, build: BuildType | null) {
  state.build = build;
  computeArtifacts(state);
}

function selectPreset(state: BuildStore, preset: string) {
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
    const configPreset = state.presets.byId[preset];
    if (configPreset.artifacts !== undefined) {
      configPreset.artifacts.forEach(artifact => {
        state.contents[artifact] = true;
      });
    }
  }
}

function computeArtifacts(state: BuildStore) {
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
      artifact.natives === undefined ||
      artifact.nativesOptional === true ||
      artifact.natives.length === config.natives.allIds.length ||
      artifact.natives.some((platform: Native) => !!state.platform[platform]);

    if (state.availability[it] && artifact.presets !== undefined) {
      // Populate presets
      artifact.presets.forEach(preset => {
        const statePreset = state.presets.byId[preset];
        if (statePreset.artifacts !== undefined) {
          statePreset.artifacts.push(it);
        }
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
}

/*

const selectVersion = (state: BuildConfig, version: string) => {
  state.version = version;
  computeArtifacts(state);
};

const selectMode = (state: BuildConfig, mode: MODES) => {
  state.mode = mode;
  computeArtifacts(state);
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


*/

const loadConfig = (state: BuildStore, config: BuildStoreSnapshot) => {
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
  state.includeJSON = config.includeJSON;
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
