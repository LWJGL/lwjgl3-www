import { BuildType, BuildStoreSnapshot, Mode, Preset, Language, Version, Native, Binding, Addon } from './types';

// Actions

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

// Action Creators

export type ActionCreator =
  | SelectBuildTypeAction
  | LoadConfigAction
  | SelectModeAction
  | SelectPresetAction
  | SelectLanguageAction
  | SelectVersionAction
  | ToggleDescriptionsAction
  | ToggleSourceAction
  | ToggleJavadocAction
  | ToggleIncludeJSONAction
  | ToggleOSGiAction
  | ToggleCompactAction
  | ToggleHardcodedAction
  | ToggleArtifactAction
  | TogglePlatformAction
  | ToggleAddonAction;

// Select/deselect a build type (e.g. Release, Stable, Nightly)
export interface SelectBuildTypeAction {
  type: Action.SELECT_TYPE;
  build: BuildType | null;
}
export const selectBuildType = (build: BuildType | null): SelectBuildTypeAction => ({
  type: Action.SELECT_TYPE,
  build,
});

// Load previously save configuration
export interface LoadConfigAction {
  type: Action.CONFIG_LOAD;
  payload: BuildStoreSnapshot;
}
export const configLoad = (payload: BuildStoreSnapshot): LoadConfigAction => ({
  type: Action.CONFIG_LOAD,
  payload,
});

// Change Mode
export interface SelectModeAction {
  type: Action.SELECT_MODE;
  mode: Mode;
}
export const selectMode = (mode: Mode): SelectModeAction => ({
  type: Action.SELECT_MODE,
  mode,
});

// Select Preset
export interface SelectPresetAction {
  type: Action.SELECT_PRESET;
  preset: Preset;
}
export const selectPreset = (preset: Preset): SelectPresetAction => ({
  type: Action.SELECT_PRESET,
  preset,
});

// Select Language
export interface SelectLanguageAction {
  type: Action.SELECT_LANGUAGE;
  language: Language;
}
export const selectLanguage = (language: Language): SelectLanguageAction => ({
  type: Action.SELECT_LANGUAGE,
  language,
});

// Select Version
export interface SelectVersionAction {
  type: Action.SELECT_VERSION;
  version: Version;
}
export const selectVersion = (version: Version) => ({ type: Action.SELECT_VERSION, version });

// Toggle Description
export interface ToggleDescriptionsAction {
  type: Action.TOGGLE_DESCRIPTIONS;
  descriptions: boolean;
}
export const toggleDescriptions = (enabled: boolean): ToggleDescriptionsAction => ({
  type: Action.TOGGLE_DESCRIPTIONS,
  descriptions: enabled,
});

// Toggle Source
export interface ToggleSourceAction {
  type: Action.TOGGLE_SOURCE;
  source: boolean;
}
export const toggleSource = (enabled: boolean): ToggleSourceAction => ({ type: Action.TOGGLE_SOURCE, source: enabled });

// Toggle JavaDoc
export interface ToggleJavadocAction {
  type: Action.TOGGLE_JAVADOC;
  javadoc: boolean;
}
export const toggleJavadoc = (enabled: boolean): ToggleJavadocAction => ({
  type: Action.TOGGLE_JAVADOC,
  javadoc: enabled,
});

// Toggle Include JSON
export interface ToggleIncludeJSONAction {
  type: Action.TOGGLE_INCLUDE_JSON;
  includeJSON: boolean;
}
export const toggleIncludeJSON = (enabled: boolean): ToggleIncludeJSONAction => ({
  type: Action.TOGGLE_INCLUDE_JSON,
  includeJSON: enabled,
});

// Toggle OSGi
export interface ToggleOSGiAction {
  type: Action.TOGGLE_OSGI;
  osgi: boolean;
}
export const toggleOSGi = (enabled: boolean): ToggleOSGiAction => ({ type: Action.TOGGLE_OSGI, osgi: enabled });

// Toggle Compact
export interface ToggleCompactAction {
  type: Action.TOGGLE_COMPACT;
  compact: boolean;
}
export const toggleCompact = (enabled: boolean): ToggleCompactAction => ({
  type: Action.TOGGLE_COMPACT,
  compact: enabled,
});

// Toggle Hardcoded
export interface ToggleHardcodedAction {
  type: Action.TOGGLE_HARDCODED;
  hardcoded: boolean;
}
export const toggleHardcoded = (enabled: boolean): ToggleHardcodedAction => ({
  type: Action.TOGGLE_HARDCODED,
  hardcoded: enabled,
});

// Toggle Artifact
export interface ToggleArtifactAction {
  type: Action.TOGGLE_ARTIFACT;
  artifact: Binding;
}
export const toggleArtifact = (artifact: Binding): ToggleArtifactAction => ({ type: Action.TOGGLE_ARTIFACT, artifact });

// Toggle Platform
export interface TogglePlatformAction {
  type: Action.TOGGLE_PLATFORM;
  platform: Native;
}
export const togglePlatform = (platform: Native): TogglePlatformAction => ({ type: Action.TOGGLE_PLATFORM, platform });

// Toggle Addon
export interface ToggleAddonAction {
  type: Action.TOGGLE_ADDON;
  addon: Addon;
}
export const toggleAddon = (addon: Addon): ToggleAddonAction => ({ type: Action.TOGGLE_ADDON, addon });
