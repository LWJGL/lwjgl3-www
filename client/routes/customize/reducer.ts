import produce from 'immer';
import React from 'react';
import { Action, ActionCreator } from './actions';
import { config, OSGiVersionMax } from './config';
import {
  Addon,
  Binding,
  BindingDefinition,
  BindingMapSelection,
  BuildStore,
  BuildStoreSnapshot,
  BuildType,
  Mode,
  Preset,
  Version,
} from './types';

// Reducer

export const reducer: React.Reducer<BuildStore, ActionCreator> = (
  state: BuildStore = config,
  action: ActionCreator
) => {
  return produce(state, (draft: BuildStore) => {
    switch (action.type) {
      case Action.CONFIG_LOAD:
        loadConfig(draft, action.payload);
        break;
      case Action.SELECT_TYPE:
        selectBuild(draft, action.build !== state.build ? action.build : null);
        break;
      case Action.SELECT_MODE:
        if (state.build !== BuildType.Stable && state.mode !== action.mode) {
          selectMode(draft, action.mode);
        }
        break;
      case Action.TOGGLE_DESCRIPTIONS:
        draft.descriptions = action.descriptions;
        break;

      case Action.TOGGLE_COMPACT:
        if (state.mode === Mode.Maven || state.mode === Mode.Ivy) {
          draft.compact = action.compact;
        }
        break;

      case Action.TOGGLE_HARDCODED:
        if (state.mode !== Mode.Zip) {
          draft.hardcoded = action.hardcoded;
        }
        break;

      case Action.TOGGLE_JAVADOC:
        if (state.mode === Mode.Zip) {
          draft.javadoc = action.javadoc;
        }
        break;

      case Action.TOGGLE_INCLUDE_JSON:
        if (state.mode === Mode.Zip) {
          draft.includeJSON = action.includeJSON;
        }
        break;

      case Action.TOGGLE_SOURCE:
        if (state.mode === Mode.Zip) {
          draft.source = action.source;
        }
        break;

      case Action.TOGGLE_OSGI:
        if (state.mode !== Mode.Zip && state.build === BuildType.Release) {
          if (action.osgi) {
            if (!checkOSGiVersion(state.version)) {
              break;
            }
          }
          draft.osgi = action.osgi;
        }
        break;

      case Action.SELECT_PRESET:
        if (state.preset !== action.preset) {
          selectPreset(draft, action.preset);
        }
        break;
      case Action.SELECT_LANGUAGE:
        if (state.mode === Mode.Gradle) {
          draft.language = action.language;
        }
        break;

      case Action.TOGGLE_PLATFORM:
        const selections = state.natives.allIds.reduce(
          (previousValue, platform) => previousValue + (state.platform[platform] ? 1 : 0),
          0
        );
        if (selections > 1 || state.platform[action.platform] === false) {
          draft.platform[action.platform] = !state.platform[action.platform];
          computeArtifacts(draft);
        }
        break;

      case Action.SELECT_VERSION:
        if (state.build === BuildType.Release && state.version !== action.version) {
          selectVersion(draft, action.version);
        }
        break;

      case Action.TOGGLE_ARTIFACT:
        if (action.artifact !== 'lwjgl') {
          doToggleArtifact(draft, action.artifact);
        }
        break;

      case Action.TOGGLE_ADDON:
        doToggleAddon(draft, action.addon);
        break;
    }
  });
};

const versionNum = (version: Version) => parseInt(version.replace(/\./g, ''), 10);

export function checkOSGiVersion(version: Version) {
  let vnum = versionNum(version);
  return 312 <= vnum && vnum <= versionNum(OSGiVersionMax);
}

function selectBuild(state: BuildStore, build: BuildType | null) {
  state.build = build;
  computeArtifacts(state);
}

function selectMode(state: BuildStore, mode: Mode) {
  state.mode = mode;
  computeArtifacts(state);
}

function selectPreset(state: BuildStore, preset: Preset) {
  // Make sure preset exists
  if (state.presets.byId[preset] === undefined) {
    return;
  }

  // Set preset
  state.preset = preset;

  if (preset === Preset.All) {
    state.artifacts.allIds.forEach(artifact => {
      state.contents[artifact] = true;
    });
  } else if (preset !== Preset.Custom) {
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

  state.artifacts = state.lwjgl[state.build === BuildType.Release ? state.version : state.build];

  // reset state
  state.availability = {} as BindingMapSelection;
  state.presets.allIds.forEach(preset => {
    state.presets.byId[preset].artifacts = [];
  });

  state.artifacts.allIds.forEach(it => {
    const artifact = state.artifacts.byId[it] as BindingDefinition;

    state.availability[it] =
      artifact.natives === undefined ||
      artifact.nativesOptional === true ||
      artifact.natives.length === config.natives.allIds.length ||
      artifact.natives.some(platform => !!state.platform[platform]);

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

  if (state.preset !== Preset.Custom) {
    selectPreset(state, state.preset);
  }

  // Stable builds are only available in ZIP
  if (state.build === BuildType.Stable && state.mode !== Mode.Zip) {
    state.mode = Mode.Zip;
  }
}

const selectVersion = (state: BuildStore, version: Version) => {
  state.version = version;
  computeArtifacts(state);
  if (state.osgi && !checkOSGiVersion(version)) {
    state.osgi = false;
  }
};

const doToggleArtifact = (state: BuildStore, artifact: Binding) => {
  state.contents[artifact] = !state.contents[artifact];

  // MATCH PRESET
  // collect selected artifacts in an Array
  const selected = state.artifacts.allIds.filter(artifact => state.contents[artifact]);

  if (selected.length === state.artifacts.allIds.length) {
    state.preset = Preset.All;
    return;
  } else if (selected.length === 1) {
    state.preset = Preset.None;
    return;
  }

  // match selected artifacts with a preset
  const presetFoundMatch = state.presets.allIds.some((presetName: Preset) => {
    // only check predefined presets
    if (presetName === Preset.Custom || presetName === Preset.All || presetName === Preset.None) {
      return false;
    }

    const preset = state.presets.byId[presetName];

    // Get preset artifacts but keep only ones present in the current artifact collection
    if (preset.artifacts !== undefined) {
      const artifacts = preset.artifacts.filter(it => !!state.artifacts.byId[it]);

      // first check length for speed, then do deep comparison
      if (artifacts.length === selected.length && artifacts.every((it, i) => it === selected[i])) {
        state.preset = presetName;
        return true;
      }
    }

    return false;
  });

  // if we didn't get a match, set it to custom preset
  if (!presetFoundMatch) {
    state.preset = Preset.Custom;
  }
};

const doToggleAddon = (state: BuildStore, addon: Addon) => {
  if (state.selectedAddons.includes(addon)) {
    state.selectedAddons = state.selectedAddons.filter(it => it !== addon);
  } else {
    state.selectedAddons.push(addon);
  }
};

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

  if (config.build === BuildType.Release && config.version !== undefined && config.versionLatest !== undefined) {
    if (config.versionLatest === state.versions[1]) {
      state.version = state.versions[0];
    } else {
      state.version = config.version;
    }
  }

  if (config.mode === Mode.Zip) {
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
    state.preset = Preset.Custom;
    state.contents = {} as BindingMapSelection;
    config.contents.forEach((binding: Binding) => {
      if (state.artifacts.byId[binding] !== undefined) {
        state.contents[binding] = true;
      }
    });
  } else {
    selectPreset(state, Preset.GettingStarted);
  }
};
