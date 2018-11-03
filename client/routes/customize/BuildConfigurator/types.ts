export type BUILD_TYPES = 'release' | 'stable' | 'nightly';
export type NATIVES = 'macos' | 'windows' | 'linux';
export type MODES = 'zip' | 'maven' | 'gradle' | 'ivy';
export type LANGUAGES = 'groovy' | 'kotlin';

export interface BindingDefinition {
  id: string;
  title: string;
  description: string;
  required?: boolean;
  natives?: Array<NATIVES>;
  nativesOptional?: boolean;
  website?: string;
  presets?: Array<string>;
}

export interface BuildOptions {
  version: string;
  alias?: string;
  allIds: Array<string>;
  byId: {
    [key: string]: BindingDefinition;
  };
}

export type BuildOptionsBuilder = (opt: BuildOptions) => BuildOptions;

export interface Build {
  id: BUILD_TYPES;
  title: string;
  description: string;
  status: null | BuildStatus;
}

export interface Mode {
  id: MODES;
  title: string;
  logo?: string;
  file?: string;
}

export interface Builds {
  byId: { [build in BUILD_TYPES]: Build };
  allIds: Array<BUILD_TYPES>;
}

export interface Modes {
  byId: { [id in MODES]: Mode };
  allIds: Array<MODES>;
}

export interface Native {
  id: NATIVES;
  title: string;
}

export interface Natives {
  byId: { [id in NATIVES]: Native };
  allIds: Array<NATIVES>;
}

export interface Languages {
  byId: {
    [id in LANGUAGES]: {
      id: LANGUAGES;
      title: string;
    }
  };
  allIds: Array<LANGUAGES>;
}

export interface Preset {
  id: string;
  title: string;
  artifacts?: Array<string>;
}

export interface Presets {
  byId: {
    [id: string]: Preset;
  };
  allIds: Array<string>;
}

export interface MavenConfig {
  groupId: string;
  artifactId: string;
  version: string;
}

export interface Addon {
  id: string;
  title: string;
  description: string;
  website: string;
  maven: MavenConfig;
  modes?: Array<MODES>;
}

export interface Addons {
  byId: {
    [id: string]: Addon;
  };
  allIds: Array<string>;
}

export interface LWJGLVersions {
  [version: string]: BuildOptions;
}

export type Platforms = { [key in NATIVES]: boolean };

export interface BuildConfig {
  lwjgl: LWJGLVersions;
  builds: Builds;
  modes: Modes;
  natives: Natives;
  languages: Languages;
  presets: Presets;
  addons: Addons;
  versions: Array<string>;

  // UI State
  build: null | BUILD_TYPES;
  mode: MODES;
  preset: string;
  descriptions: boolean;
  compact: boolean;
  hardcoded: boolean;
  javadoc: boolean;
  includeJSON: boolean;
  source: boolean;
  osgi: boolean;
  language: string;
  platform: Platforms;
  version: string;
  contents: {
    [k: string]: boolean;
  };
  availability: {
    [k: string]: boolean;
  };
  selectedAddons: Array<string>;
  artifacts: BuildOptions;
}

export interface BuildConfigStored {
  build: BUILD_TYPES;
  mode: MODES;
  selectedAddons: Array<string>;
  platform: Array<NATIVES>;
  descriptions: boolean;
  compact: boolean;
  hardcoded: boolean;
  javadoc: boolean;
  includeJSON: boolean;
  source: boolean;
  osgi: boolean;
  language: string;
  preset?: string;
  contents?: Array<string>;
  version?: string;
  versionLatest?: string;
}

// Reducer

export interface BuildStatusSuccess {
  lastModified: string;
  version?: string;
}

export interface BuildStatusError {
  error: string;
}

export type BuildStatus = BuildStatusSuccess | BuildStatusError;
