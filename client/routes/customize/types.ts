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
  LWJGL322 = '3.2.2',
  LWJGL323 = '3.2.3',
  LWJGL330 = '3.3.0',
  LWJGL331 = '3.3.1',
  LWJGL332 = '3.3.2',
  Nightly = 'nightly',
}

export enum Binding {
  // Core
  LWJGL = 'lwjgl',
  // Bindings
  ASSIMP = 'lwjgl-assimp',
  BGFX = 'lwjgl-bgfx',
  CUDA = 'lwjgl-cuda',
  EGL = 'lwjgl-egl',
  FMOD = 'lwjgl-fmod',
  GLFW = 'lwjgl-glfw',
  HARFBUZZ = 'lwjgl-harfbuzz',
  JAWT = 'lwjgl-jawt',
  JEMALLOC = 'lwjgl-jemalloc',
  KTX = 'lwjgl-ktx',
  LIBDIVIDE = 'lwjgl-libdivide',
  LLVM = 'lwjgl-llvm',
  LMDB = 'lwjgl-lmdb',
  LZ4 = 'lwjgl-lz4',
  MEOW = 'lwjgl-meow',
  MESHOPTIMIZER = 'lwjgl-meshoptimizer',
  NANOVG = 'lwjgl-nanovg',
  NFD = 'lwjgl-nfd',
  NUKLEAR = 'lwjgl-nuklear',
  ODBC = 'lwjgl-odbc',
  OPENAL = 'lwjgl-openal',
  OPENCL = 'lwjgl-opencl',
  OPENGL = 'lwjgl-opengl',
  OPENGLES = 'lwjgl-opengles',
  OPENVR = 'lwjgl-openvr',
  OPENXR = 'lwjgl-openxr',
  OPUS = 'lwjgl-opus',
  OVR = 'lwjgl-ovr',
  PAR = 'lwjgl-par',
  REMOTERY = 'lwjgl-remotery',
  RPMALLOC = 'lwjgl-rpmalloc',
  SHADERC = 'lwjgl-shaderc',
  SPVC = 'lwjgl-spvc',
  SSE = 'lwjgl-sse',
  STB = 'lwjgl-stb',
  TINYEXR = 'lwjgl-tinyexr',
  TINYFD = 'lwjgl-tinyfd',
  TOOTLE = 'lwjgl-tootle',
  VMA = 'lwjgl-vma',
  VULKAN = 'lwjgl-vulkan',
  XXHASH = 'lwjgl-xxhash',
  YOGA = 'lwjgl-yoga',
  ZSTD = 'lwjgl-zstd',
}

export enum Addon {
  JOML = 'joml',
  LWJGLXDebug = 'lwjglx-debug',
  LWJGLXLWJGL3Awt = 'lwjgl3-awt',
  Steamworks4J = 'steamworks4j',
  Steamworks4JServer = 'steamworks4j-server',
}

export enum BuildType {
  Release = 'release',
  Nightly = 'nightly',
}

export enum Native {
  Linux = 'linux',
  LinuxARM64 = 'linux-arm64',
  LinuxARM32 = 'linux-arm32',
  MacOS = 'macos',
  MacOSARM64 = 'macos-arm64',
  Windows = 'windows',
  WindowsX86 = 'windows-x86',
  WindowsARM64 = 'windows-arm64',
}

export const NATIVE_LTE_322 = [Native.Linux, Native.MacOS, Native.Windows];
export const NATIVE_ALL = [
  Native.Linux,
  Native.LinuxARM64,
  Native.LinuxARM32,
  Native.MacOS,
  Native.MacOSARM64,
  Native.Windows,
  Native.WindowsX86,
  Native.WindowsARM64,
];

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

export type BindingMap = { [key in Binding]?: BindingDefinition };
export type BindingMapUnsafe = { [key in Binding]: BindingDefinition };
export type BindingMapSelection = { [key in Binding]: boolean | undefined };

export interface BuildBindings {
  version: Version;
  alias?: Version;
  allIds: Array<Binding>;
  byId: BindingMap;
}

export type VersionCollection = { [key in Version]: BuildBindings };

export interface BuildDefinition {
  id: BuildType;
  title: string;
  description: string;
}

export type BuildTypeMap = { [key in BuildType]: BuildDefinition };

export interface BuildCollection {
  byId: BuildTypeMap;
  allIds: Array<BuildType>;
}

export interface ModeDefinition {
  id: Mode;
  title: string;
  logo?: string;
  file?: string;
}

export type ModeMap = { [key in Mode]: ModeDefinition };

export interface ModesCollection {
  byId: ModeMap;
  allIds: Array<Mode>;
}

export interface NativeDefinition {
  id: Native;
  title: string;
  since: Version;
}

export type NativeMap = { [key in Native]: NativeDefinition };

export interface NativesCollection {
  byId: NativeMap;
  allIds: Array<Native>;
}

export interface LanguageDefinition {
  id: Language;
  title: string;
}

export type LanguageMap = { [key in Language]: LanguageDefinition };

export interface LanguageCollection {
  byId: LanguageMap;
  allIds: Array<Language>;
}

export interface PresetDefinition {
  id: Preset;
  title: string;
  artifacts?: Array<Binding>;
}

export type PresetMap = { [key in Preset]: PresetDefinition };

export interface PresetCollection {
  byId: PresetMap;
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

export type AddonMap = { [key in Addon]: AddonDefinition };

export interface AddonCollection {
  byId: AddonMap;
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
  language: Language;
  platform: PlatformSelection;
  version: Version;
  contents: BindingMapSelection;
  availability: BindingMapSelection;
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

export interface DownloadHandle {
  start: () => void;
  stop: () => void;
}
