import {
  BuildType,
  // NATIVES,
  // MODES,
  // LANGUAGES
  BuildStoreSnapshot,
} from './types';

export enum ActionKeys {
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

export type ActionTypes = BuildSelectTypeAction | BuildConfigLoadAction;

// Select/deselect a build type (e.g. Release, Stable, Nightly)

export interface BuildSelectTypeAction {
  type: ActionKeys.SELECT_TYPE;
  build: BuildType | null;
}

export const changeType = (build: BuildType | null): BuildSelectTypeAction => ({
  type: ActionKeys.SELECT_TYPE,
  build,
});

// Load previously save configuration

export interface BuildConfigLoadAction {
  type: ActionKeys.CONFIG_LOAD;
  payload: BuildStoreSnapshot;
}

export const configLoad = (payload: BuildStoreSnapshot): BuildConfigLoadAction => ({
  type: ActionKeys.CONFIG_LOAD,
  payload,
});
