export const BUILD_RELEASE = 'release';
export const BUILD_STABLE = 'stable';
export const BUILD_NIGHTLY = 'nightly';
export type BUILD_TYPES = 'release' | 'stable' | 'nightly';

export const NATIVE_MAC = 'macos';
export const NATIVE_WIN = 'windows';
export const NATIVE_LINUX = 'linux';
export const NATIVE_ALL = [NATIVE_WIN, NATIVE_MAC, NATIVE_LINUX];
export type NATIVES = 'macos' | 'windows' | 'linux';

export const MODE_ZIP = 'zip';
export const MODE_MAVEN = 'maven';
export const MODE_GRADLE = 'gradle';
export const MODE_IVY = 'ivy';
export type MODES = 'zip' | 'maven' | 'gradle' | 'ivy';

export const STORAGE_KEY = 'lwjgl-build-config';
