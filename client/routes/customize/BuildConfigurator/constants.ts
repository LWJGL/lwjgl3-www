import { NATIVES } from './types';

export const BUILD_RELEASE = 'release';
export const BUILD_STABLE = 'stable';
export const BUILD_NIGHTLY = 'nightly';

export const NATIVE_MAC = 'macos';
export const NATIVE_WIN = 'windows';
export const NATIVE_LINUX = 'linux';
export const NATIVE_ALL: Array<NATIVES> = [NATIVE_WIN, NATIVE_MAC, NATIVE_LINUX];

export const MODE_ZIP = 'zip';
export const MODE_MAVEN = 'maven';
export const MODE_GRADLE = 'gradle';
export const MODE_IVY = 'ivy';

export const LANGUAGE_GROOVY = 'groovy';
export const LANGUAGE_KOTLIN = 'kotlin';
