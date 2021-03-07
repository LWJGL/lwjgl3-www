import produce from 'immer';
import { config, getDefaultPlatform, OSGiVersionMax } from './config';
import { Addon, BuildType, Mode, NATIVE_ALL, Preset } from './types';

import type { RadioOptions } from './ConnectedRadio';

import type {
  Binding,
  BindingDefinition,
  BindingMapSelection,
  BuildStore,
  BuildStoreSnapshot,
  Version,
  Language,
  Native,
} from './types';

export enum Action {
  BUILD_STATUS = 'BUILD/STATUS',
  SELECT_TYPE = 'BUILD/SELECT_TYPE',
  SELECT_MODE = 'BUILD/SELECT_MODE',
  SELECT_PRESET = 'BUILD/SELECT_PRESET',
  SELECT_LANGUAGE = 'BUILD/SELECT_LANGUAGE',
  SELECT_VERSION = 'BUILD/SELECT_VERSION',
  TOGGLE_DESCRIPTIONS = 'BUILD/TOGGLE_DESCRIPTIONS',
  TOGGLE_SOURCE = 'BUILD/TOGGLE_SOURCE',
  TOGGLE_JAVADOC = 'BUILD/TOGGLE_JAVADOC',
  TOGGLE_INCLUDE_JSON = 'BUILD/TOGGLE_INCLUDE_JSON',
  TOGGLE_OSGI = 'BUILD/TOGGLE_OSGI',
  TOGGLE_COMPACT = 'BUILD/TOGGLE_COMPACT',
  TOGGLE_HARDCODED = 'BUILD/TOGGLE_HARDCODED',
  TOGGLE_PLATFORM = 'BUILD/TOGGLE_PLATFORM',
  TOGGLE_ARTIFACT = 'BUILD/TOGGLE_ARTIFACT',
  TOGGLE_ADDON = 'BUILD/TOGGLE_ADDON',
  CONFIG_LOAD = 'BUILD/CONFIG_LOAD',
}

export type ActionMessage =
  | ActionBuildTypeSelect
  | ActionConfigLoad
  | ActionModeSelect
  | ActionPresetSelect
  | ActionLanguageSelect
  | ActionVersionSelect
  | ActionToggle<
      | Action.TOGGLE_DESCRIPTIONS
      | Action.TOGGLE_SOURCE
      | Action.TOGGLE_JAVADOC
      | Action.TOGGLE_INCLUDE_JSON
      | Action.TOGGLE_HARDCODED
      | Action.TOGGLE_OSGI
      | Action.TOGGLE_COMPACT
    >
  | ActionArtifactToggle
  | ActionPlatformToggle
  | ActionAddonToggle;

export interface ActionToggle<T> {
  type: T;
}

// Select/deselect a build type (e.g. Release, Nightly)
export interface ActionBuildTypeSelect {
  type: Action.SELECT_TYPE;
  build: BuildType | null;
}
export const createActionBuiltTypeSelect = (build: BuildType | null): ActionBuildTypeSelect => ({
  type: Action.SELECT_TYPE,
  build,
});

// Load previously save configuration
export interface ActionConfigLoad {
  type: Action.CONFIG_LOAD;
  payload: BuildStoreSnapshot;
}
export const createActionConfigLoad = (payload: BuildStoreSnapshot): ActionConfigLoad => ({
  type: Action.CONFIG_LOAD,
  payload,
});

// Change Mode
export interface ActionModeSelect {
  type: Action.SELECT_MODE;
  mode: Mode;
}
export const createActionModeSelect = (mode: Mode): ActionModeSelect => ({
  type: Action.SELECT_MODE,
  mode,
});

// Select Preset
export interface ActionPresetSelect {
  type: Action.SELECT_PRESET;
  preset: Preset;
}
export const createActionPresetSelect = (preset: Preset): ActionPresetSelect => ({
  type: Action.SELECT_PRESET,
  preset,
});

// Select Language
export interface ActionLanguageSelect {
  type: Action.SELECT_LANGUAGE;
  language: Language;
}
export const createActionLanguageSelect = (language: Language): ActionLanguageSelect => ({
  type: Action.SELECT_LANGUAGE,
  language,
});

// Select Version
export interface ActionVersionSelect {
  type: Action.SELECT_VERSION;
  version: Version;
}
export const createActionVersionSelect = (version: Version): ActionVersionSelect => ({
  type: Action.SELECT_VERSION,
  version,
});

// Toggle Description
export const createActionDescriptionsToggle = (): ActionToggle<Action.TOGGLE_DESCRIPTIONS> => ({
  type: Action.TOGGLE_DESCRIPTIONS,
});

// Toggle Source
export const createActionSourceToggle = (): ActionToggle<Action.TOGGLE_SOURCE> => ({
  type: Action.TOGGLE_SOURCE,
});

// Toggle JavaDoc
export const createActionJavadocToggle = (): ActionToggle<Action.TOGGLE_JAVADOC> => ({
  type: Action.TOGGLE_JAVADOC,
});

// Toggle Include JSON
export const createActionIncludeJSONToggle = (): ActionToggle<Action.TOGGLE_INCLUDE_JSON> => ({
  type: Action.TOGGLE_INCLUDE_JSON,
});

// Toggle OSGi
export const createActionOSGiToggle = (): ActionToggle<Action.TOGGLE_OSGI> => ({
  type: Action.TOGGLE_OSGI,
});

// Toggle Compact
export const createActionCompactToggle = (): ActionToggle<Action.TOGGLE_COMPACT> => ({
  type: Action.TOGGLE_COMPACT,
});

// Toggle Hardcoded
export const createActionHardcodedToggle = (): ActionToggle<Action.TOGGLE_HARDCODED> => ({
  type: Action.TOGGLE_HARDCODED,
});

// Toggle Artifact
export interface ActionArtifactToggle {
  type: Action.TOGGLE_ARTIFACT;
  artifact: Binding;
}
export const createActionArtifactToggle = (artifact: Binding): ActionArtifactToggle => ({
  type: Action.TOGGLE_ARTIFACT,
  artifact,
});

// Toggle Platform
export interface ActionPlatformToggle {
  type: Action.TOGGLE_PLATFORM;
  platform: Native;
}
export const createActionPlatformToggle = (platform: Native): ActionPlatformToggle => ({
  type: Action.TOGGLE_PLATFORM,
  platform,
});

// Toggle Addon
export interface ActionAddonToggle {
  type: Action.TOGGLE_ADDON;
  addon: Addon;
}
export const createActionAddonToggle = (addon: Addon): ActionAddonToggle => ({ type: Action.TOGGLE_ADDON, addon });

// Selectors

// export const selectorStore = (state: BuildStore): BuildStore => state;
export const selectorDescriptions = (state: BuildStore): boolean => state.descriptions;
export const selectorHasLanguageOption = (state: BuildStore): boolean => state.mode === Mode.Gradle;
export const selectorBuild = (state: BuildStore) => state.build;
export const selectorBuilds = (state: BuildStore) => state.builds;
export const selectorIsBuildSelected = (state: BuildStore): boolean => state.build !== null;
export const selectorIsBuildRelease = (state: BuildStore): boolean => state.build === BuildType.Release;
export const selectorMode = (state: BuildStore) => state.mode;
export const selectorModes = (state: BuildStore) => state.modes;
const selectorSource = (state: BuildStore) => state.source;
const selectorJavaDoc = (state: BuildStore) => state.javadoc;
const selectorIncludeJSON = (state: BuildStore) => state.includeJSON;
const selectorPreset = (state: BuildStore) => state.preset;
const selectorHardcoded = (state: BuildStore) => state.hardcoded;
const selectorCompact = (state: BuildStore) => state.compact;
const selectorOSGi = (state: BuildStore) => state.osgi;
const selectorLanguage = (state: BuildStore) => state.language;
const selectorVersion = (state: BuildStore) => state.version;
const selectorHasCompactModeOption = (state: BuildStore): boolean =>
  state.mode === Mode.Maven || state.mode === Mode.Ivy;
const selectorIsModeZip = (state: BuildStore): boolean => state.mode === Mode.Zip;
const selectorIsModeNotZip = (state: BuildStore): boolean => state.mode !== Mode.Zip;
const selectorShowOSGi = (state: BuildStore): boolean =>
  state.mode !== Mode.Zip && state.build === BuildType.Release && checkOSGiVersion(state.version);

export const selectorNatives = (store: BuildStore) => store.natives;
export const selectorArtifactsVersion = (store: BuildStore) => store.artifacts.version;
export const selectorPlatformsSelected = (store: BuildStore) => store.platform;

export const selectorAddons = (store: BuildStore) => store.addons;
export const selectorAddonsSelected = (store: BuildStore) => store.selectedAddons;

export const selectorContents = (store: BuildStore) => store.contents;
export const selectorAvailability = (store: BuildStore) => store.availability;
export const selectorArtifacts = (store: BuildStore) => store.artifacts;
// Fields

export const fields = {
  mode: {
    name: 'mode',
    value: selectorMode,
    action: createActionModeSelect,
    options: ({ modes: { allIds, byId }, build }: BuildStore): RadioOptions =>
      allIds.map((mode) => ({
        value: mode,
        label: byId[mode].title,
      })),
  },
  descriptions: {
    children: 'Show descriptions',
    checked: selectorDescriptions,
    action: createActionDescriptionsToggle,
  },
  source: {
    children: 'Include source',
    checked: selectorSource,
    hidden: selectorIsModeNotZip,
    action: createActionSourceToggle,
  },
  javadoc: {
    children: 'Include JavaDoc',
    checked: selectorJavaDoc,
    hidden: selectorIsModeNotZip,
    action: createActionJavadocToggle,
  },
  includeJSON: {
    children: 'Include build config',
    checked: selectorIncludeJSON,
    hidden: selectorIsModeNotZip,
    action: createActionIncludeJSONToggle,
  },
  hardcoded: {
    children: 'Do not use variables',
    checked: selectorHardcoded,
    hidden: selectorIsModeZip,
    action: createActionHardcodedToggle,
  },
  compact: {
    children: 'Compact Mode',
    checked: selectorCompact,
    hidden: (state: BuildStore) => !selectorHasCompactModeOption(state),
    action: createActionCompactToggle,
  },
  osgi: {
    children: 'OSGi Mode',
    checked: selectorOSGi,
    hidden: (state: BuildStore) => !selectorShowOSGi(state),
    action: createActionOSGiToggle,
  },
  language: {
    name: 'language',
    value: selectorLanguage,
    action: createActionLanguageSelect,
    options: ({ languages: { allIds, byId } }: BuildStore): RadioOptions =>
      allIds.map((lang: Language) => ({
        value: lang,
        label: byId[lang].title,
      })),
  },
  preset: {
    name: 'preset',
    value: selectorPreset,
    action: createActionPresetSelect,
    options: ({ presets: { allIds, byId }, preset }: BuildStore): RadioOptions =>
      allIds.map((presetId) => ({
        value: presetId,
        label: byId[presetId].title,
        disabled: preset !== presetId && presetId === 'custom',
      })),
  },
  version: {
    name: 'version',
    value: selectorVersion,
    action: createActionVersionSelect,
    options: ({ versions }: BuildStore): RadioOptions =>
      versions.map((version) => ({
        value: version,
        label: version,
        disabled: version === '3.0.0',
      })),
  },
};

// Reducer
export const reducer: React.Reducer<BuildStore, ActionMessage> = (
  state: BuildStore = config,
  action: ActionMessage
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
        if (state.mode !== action.mode) {
          selectMode(draft, action.mode);
        }
        break;
      case Action.TOGGLE_DESCRIPTIONS:
        draft.descriptions = !draft.descriptions;
        break;

      case Action.TOGGLE_COMPACT:
        if (state.mode === Mode.Maven || state.mode === Mode.Ivy) {
          draft.compact = !draft.compact;
        }
        break;

      case Action.TOGGLE_HARDCODED:
        if (state.mode !== Mode.Zip) {
          draft.hardcoded = !draft.hardcoded;
        }
        break;

      case Action.TOGGLE_JAVADOC:
        if (state.mode === Mode.Zip) {
          draft.javadoc = !draft.javadoc;
        }
        break;

      case Action.TOGGLE_INCLUDE_JSON:
        if (state.mode === Mode.Zip) {
          draft.includeJSON = !draft.includeJSON;
        }
        break;

      case Action.TOGGLE_SOURCE:
        if (state.mode === Mode.Zip) {
          draft.source = !draft.source;
        }
        break;

      case Action.TOGGLE_OSGI:
        if (state.mode !== Mode.Zip && state.build === BuildType.Release) {
          if (draft.osgi) {
            if (!checkOSGiVersion(state.version)) {
              break;
            }
          }
          draft.osgi = !draft.osgi;
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

export function versionNum(version: Version) {
  return parseInt(version.replace(/\./g, ''), 10);
}

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
    state.artifacts.allIds.forEach((artifact) => {
      state.contents[artifact] = true;
    });
  } else if (preset !== Preset.Custom) {
    state.artifacts.allIds.forEach((artifact) => {
      state.contents[artifact] = false;
    });
    const configPreset = state.presets.byId[preset];
    if (configPreset.artifacts !== undefined) {
      configPreset.artifacts.forEach((artifact) => {
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

  const vnum = versionNum(state.artifacts.version);
  NATIVE_ALL.forEach((p) => {
    if (state.platform[p] && vnum < versionNum(config.natives.byId[p].since)) {
      state.platform[p] = false;
    }
  });
  if (!NATIVE_ALL.some((p) => state.platform[p])) {
    state.platform[getDefaultPlatform()] = true;
  }

  // reset state
  state.availability = {} as BindingMapSelection;
  state.presets.allIds.forEach((preset) => {
    state.presets.byId[preset].artifacts = [];
  });

  state.artifacts.allIds.forEach((it) => {
    const artifact = state.artifacts.byId[it] as BindingDefinition;

    state.availability[it] =
      artifact.natives === undefined ||
      artifact.nativesOptional === true ||
      artifact.natives.length === config.natives.allIds.length ||
      artifact.natives.some((platform) => !!state.platform[platform]);

    if (state.availability[it] && artifact.presets !== undefined) {
      // Populate presets
      artifact.presets.forEach((preset) => {
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
  const selected = state.artifacts.allIds.filter((artifact) => state.contents[artifact]);

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
      const artifacts = preset.artifacts.filter((it) => !!state.artifacts.byId[it]);

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
    state.selectedAddons = state.selectedAddons.filter((it) => it !== addon);
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
    state.natives.allIds.forEach((platform) => {
      state.platform[platform] = false;
    });
    config.platform.forEach((platform) => {
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
