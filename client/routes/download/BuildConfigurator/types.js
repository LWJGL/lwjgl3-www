export type BUILD_TYPES = 'release' | 'stable' | 'nightly';
export type NATIVES = 'macos' | 'windows' | 'linux';
export type MODES = 'zip' | 'maven' | 'gradle' | 'ivy';
export type LANGUAGES = 'groovy' | 'kotlin';

export type BindingDefinition = {|
  id: string,
  title: string,
  description: string,
  natives?: Array<string>,
  required?: boolean,
  website?: string,
|};

export type BuildOptions = {|
  version: string,
  alias?: string,
  allIds?: Array<string>,
  byId: {|
    [string]: BindingDefinition,
  |},
|};

export type BuildOptionsBuilder = BuildOptions => BuildOptions;

export type Build = {|
  id: BUILD_TYPES,
  title: string,
  description: string,
  status: null,
|};

export type Mode = {|
  id: MODES,
  title: string,
  logo?: string,
  file?: string,
|};

export type Builds = {|
  byId: {|
    [BUILD_TYPES]: Build,
  |},
  allIds?: Array<string>,
|};

export type Modes = {|
  byId: {|
    [MODES]: Mode,
  |},
  allIds?: Array<string>,
|};

export type Native = {|
  id: NATIVES,
  title: string,
|};

export type Natives = {|
  byId: {
    [NATIVES]: Native,
  },
  allIds: Array<NATIVES>,
|};

export type Languages = {
  byId: {
    [LANGUAGES]: {
      id: LANGUAGES,
      title: string,
    },
  },
  allIds?: Array<string>,
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
  allIds?: Array<string>,
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
  maven?: MavenConfig,
  modes?: Array<MODES>,
|};

export type Addons = {|
  byId: {
    [string]: Addon,
  },
  allIds: Array<string>,
|};

export type LWJGLVersions = {
  [string]: BuildOptions,
};

export type Platform = {|
  [NATIVES]: boolean,
|};

export type BuildConfig = {|
  lwjgl: LWJGLVersions,
  builds: Builds,
  modes: Modes,
  natives: Natives,
  languages: Languages,
  presets: Presets,
  addons: Addons,
  versions?: Array<string>,

  // UI State
  build: null,
  mode: MODES,
  preset: string,
  descriptions: boolean,
  compact: boolean,
  hardcoded: boolean,
  javadoc: boolean,
  source: boolean,
  osgi: boolean,
  language: null | string,
  platform: Platform,
  version: null | string,
  downloading: boolean,
  progress: Array<string>,
  contents: {},
  availability: {},
  selectedAddons: Array<string>,
|};
