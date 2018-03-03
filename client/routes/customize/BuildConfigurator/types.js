// @flow
export type BUILD_TYPES = 'release' | 'stable' | 'nightly';
export type NATIVES = 'macos' | 'windows' | 'linux';
export type MODES = 'zip' | 'maven' | 'gradle' | 'ivy';
export type LANGUAGES = 'groovy' | 'kotlin';

export type BindingDefinition = {
  id: string,
  title: string,
  description: string,
  required?: boolean,
  natives?: Array<NATIVES>,
  nativesOptional?: boolean,
  website?: string,
  presets?: Array<string>,
};

export type BuildOptions = {
  version: string,
  alias?: string,
  allIds: Array<string>,
  byId: {
    [string]: BindingDefinition,
  },
};

export type BuildOptionsBuilder = BuildOptions => BuildOptions;

export type Build = {|
  id: BUILD_TYPES,
  title: string,
  description: string,
  status: null | BuildStatus,
|};

export type Mode = {|
  id: MODES,
  title: string,
  logo?: string,
  file?: string,
|};

export type Builds = {
  byId: {
    [BUILD_TYPES]: Build,
  },
  allIds: Array<BUILD_TYPES>,
};

export type Modes = {
  byId: {
    [id: MODES]: Mode,
  },
  allIds: Array<MODES>,
};

export type Native = {|
  id: NATIVES,
  title: string,
|};

export type Natives = {|
  byId: {
    [id: NATIVES]: Native,
  },
  allIds: Array<NATIVES>,
|};

export type Languages = {
  byId: {
    [id: LANGUAGES]: {
      id: LANGUAGES,
      title: string,
    },
  },
  allIds: Array<LANGUAGES>,
};

export type Preset = {
  id: string,
  title: string,
  artifacts?: Array<string>,
};

export type Presets = {|
  byId: {
    [string]: Preset,
  },
  allIds: Array<string>,
|};

export type MavenConfig = {|
  groupId: string,
  artifactId: string,
  version: string,
|};

export type Addon = {|
  id: string,
  title: string,
  description: string,
  website: string,
  maven: MavenConfig,
  modes?: Array<MODES>,
|};

export type Addons = {|
  byId: {
    [id: string]: Addon,
  },
  allIds: Array<string>,
|};

export type LWJGLVersions = {
  [version: string]: BuildOptions,
};

export type Platforms = {
  [platform: NATIVES]: boolean,
};

export type BuildConfig = {
  lwjgl: LWJGLVersions,
  builds: Builds,
  modes: Modes,
  natives: Natives,
  languages: Languages,
  presets: Presets,
  addons: Addons,
  versions: Array<string>,

  // UI State
  build: null | BUILD_TYPES,
  mode: MODES,
  preset: string,
  descriptions: boolean,
  compact: boolean,
  hardcoded: boolean,
  javadoc: boolean,
  source: boolean,
  osgi: boolean,
  language: string,
  platform: Platforms,
  version: string,
  contents: {},
  availability: {},
  selectedAddons: Array<string>,
  artifacts: BuildOptions,
};

export type BuildConfigStored = {
  build: BUILD_TYPES,
  mode: MODES,
  selectedAddons: Array<string>,
  platform: Array<NATIVES>,
  descriptions: boolean,
  compact: boolean,
  hardcoded: boolean,
  javadoc: boolean,
  source: boolean,
  osgi: boolean,
  language: string,
  preset?: string,
  contents?: Array<string>,
  version?: string,
  versionLatest?: string,
};

// Reducer

export type BuildStatusSuccess = {|
  lastModified: string,
  version?: string,
|};

export type BuildStatusError = {| error: string |};

export type BuildStatus = BuildStatusSuccess | BuildStatusError;
