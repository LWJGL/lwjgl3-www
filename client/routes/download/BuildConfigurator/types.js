export type BUILD_TYPES = 'release' | 'stable' | 'nightly';
export type NATIVES = 'macos' | 'windows' | 'linux';
export type MODES = 'zip' | 'maven' | 'gradle' | 'ivy';

export type BindingDefinition = {
  id: string,
  title: string,
  description: string,
  natives?: Array<string>,
  required?: boolean,
};

export type BuildOptions = {
  version: string,
  alias?: string,
  allIds?: Array<string>,
  byId: {
    [string]: BindingDefinition,
  },
};

export type BuildOptionsBuilder = BuildOptions => BuildOptions;

export type Build = {
  id: BUILD_TYPES,
  title: string,
  description: string,
  status: null,
};

export type Mode = {
  id: MODES,
  title: string,
  logo?: string,
  file?: string,
};

export type Builds = {
  byId: {
    [BUILD_TYPES]: Build,
    allIds?: Array<string>,
  },
  modes: {
    [MODES]: Mode,
  },
};

export type BuildConfig = {
  lwjgl: {},
  builds: Builds,
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
  platform: {},
  version: null | string,
  downloading: boolean,
  progress: Array<string>,
  contents: {},
  availability: {},
  selectedAddons: Array<string>,
};
