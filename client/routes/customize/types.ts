export enum Version {
  LWJGL300 = '3.0.0',
  LWJGL310 = '3.1.0',
  LWJGL311 = '3.1.1',
  LWJGL312 = '3.1.2',
  LWJGL313 = '3.1.3',
  LWJGL314 = '3.1.4',
  LWJGL315 = '3.1.5',
  LWJGL316 = '3.1.6',
  LWJGL320 = '3.2.0',
  LWJGL321 = '3.2.1',
  Stable = 'stable',
  Nightly = 'nightly',
}

export enum Binding {
  LWJGL = 'lwjgl',
  EGL = 'lwjgl-egl',
  GLFW = 'lwjgl-glfw',
  JAWT = 'lwjgl-jawt',
  Jemalloc = 'lwjgl-jemalloc',
  NanoSVG = 'lwjgl-nanovg',
  Nfd = 'lwjgl-nfd',
  OpenAL = 'lwjgl-openal',
  OpenCL = 'lwjgl-opencl',
  OpenGL = 'lwjgl-opengl',
  OpenGLES = 'lwjgl-opengles',
  OVR = 'lwjgl-ovr',
  ParShapes = 'lwjgl-par',
  SSE = 'lwjgl-sse',
  Stb = 'lwjgl-stb',
  Vulkan = 'lwjgl-vulkan',
  XxHash = 'lwjgl-xxhash',
  Bgfx = 'lwjgl-bgfx',
  LMDB = 'lwjgl-lmdb',
  Nuklear = 'lwjgl-nuklear',
  TinyFD = 'lwjgl-tinyfd',
  Assimp = 'lwjgl-assimp',
  OpenVR = 'lwjgl-openvr',
  TinyEXR = 'lwjgl-tinyexr',
  Yoga = 'lwjgl-yoga',
  Rpmalloc = 'lwjgl-rpmalloc',
  LZ4 = 'lwjgl-lz4',
  ODBC = 'lwjgl-odbc',
  Remotery = 'lwjgl-remotery',
  Zstandard = 'lwjgl-zstd',
  Tootle = 'lwjgl-tootle',
  VMA = 'lwjgl-vma',
  Bullet = 'lwjgl-bullet',
  CUDA = 'lwjgl-cuda',
  Libdivide = 'lwjgl-libdivide',
  Meow = 'lwjgl-meow',
  Opus = 'lwjgl-opus',
}

export enum Addon {
  JOML = 'joml',
  LWJGLXDebug = 'lwjglx-debug',
  Steamworks4J = 'steamworks4j',
  Steamworks4JServer = 'steamworks4j-server',
}

export enum BuildType {
  Release = 'release',
  Stable = 'stable',
  Nightly = 'nightly',
}

export enum Native {
  Windows = 'windows',
  Linux = 'linux',
  MacOS = 'macos',
}

export const NATIVE_ALL = [Native.Windows, Native.Linux, Native.MacOS];

export enum Mode {
  Zip = 'zip',
  Maven = 'maven',
  Gradle = 'gradle',
  Ivy = 'ivy',
}

export enum Language {
  Groovy = 'groovy',
  Kotlin = 'kotlin',
}

export enum Preset {
  None = 'none',
  Custom = 'custom',
  All = 'all',
  GettingStarted = 'getting-started',
  OpenGL = 'minimal-opengl',
  OpenGLES = 'minimal-opengles',
  Vulkan = 'minimal-vulkan',
}

export interface BindingDefinition {
  id: Binding;
  title: string;
  description: string;
  required?: boolean;
  natives?: Array<Native>;
  nativesOptional?: boolean;
  website?: string;
  presets?: Array<Preset>;
}

export interface BuildBindings {
  version: Version;
  alias?: Version;
  allIds: Array<Binding>;
  byId: { [key in Binding]?: BindingDefinition };
}

export type VersionCollection = { [version in Version]: BuildBindings };

export interface BuildDefinition {
  id: BuildType;
  title: string;
  description: string;
}

export interface BuildCollection {
  byId: { [build in BuildType]: BuildDefinition };
  allIds: Array<BuildType>;
}

export interface ModeDefinition {
  id: Mode;
  title: string;
  logo?: string;
  file?: string;
}

export interface ModesCollection {
  byId: { [id in Mode]: ModeDefinition };
  allIds: Array<Mode>;
}

export interface NativeDefinition {
  id: Native;
  title: string;
}

export interface NativesCollection {
  byId: { [id in Native]: NativeDefinition };
  allIds: Array<Native>;
}

export interface LanguageCollection {
  byId: {
    [id in Language]: {
      id: Language;
      title: string;
    }
  };
  allIds: Array<Language>;
}

export interface PresetDefinition {
  id: Preset;
  title: string;
  artifacts?: Array<Binding>;
}

export interface PresetCollection {
  byId: { [id in Preset]: PresetDefinition };
  allIds: Array<Preset>;
}

export interface MavenConfig {
  groupId: string;
  artifactId: string;
  version: string;
}

export interface AddonDefinition {
  id: Addon;
  title: string;
  description: string;
  website: string;
  maven: MavenConfig;
  modes?: Array<Mode>;
}

export interface AddonCollection {
  byId: { [id in Addon]: AddonDefinition };
  allIds: Array<Addon>;
}

export type PlatformSelection = { [key in Native]: boolean };

export interface BuildStore {
  lwjgl: VersionCollection;
  builds: BuildCollection;
  modes: ModesCollection;
  natives: NativesCollection;
  languages: LanguageCollection;
  presets: PresetCollection;
  addons: AddonCollection;
  versions: Array<Version>;

  // UI State
  build: null | BuildType;
  mode: Mode;
  preset: Preset;
  descriptions: boolean;
  compact: boolean;
  hardcoded: boolean;
  javadoc: boolean;
  includeJSON: boolean;
  source: boolean;
  osgi: boolean;
  language: Language | null;
  platform: PlatformSelection;
  version: Version;
  contents: { [k in Binding]: boolean };
  availability: { [k in Binding]: boolean };
  selectedAddons: Array<Addon>;
  artifacts: BuildBindings;
}

export interface BuildStoreSnapshot {
  build: BuildType;
  mode: Mode;
  selectedAddons: Array<Addon>;
  platform: Array<Native>;
  descriptions: boolean;
  compact: boolean;
  hardcoded: boolean;
  javadoc: boolean;
  includeJSON: boolean;
  source: boolean;
  osgi: boolean;
  language: Language;
  preset?: Preset;
  contents?: Array<Binding>;
  version?: Version;
  versionLatest?: Version;
}
