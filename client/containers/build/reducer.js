const BUILD_RELEASE = 'release';
const BUILD_STABLE = 'stable';
const BUILD_NIGHTLY = 'nightly';
const BUILD_ALL = [BUILD_RELEASE, BUILD_STABLE, BUILD_NIGHTLY];

const NATIVE_MAC = 'macos';
const NATIVE_WIN = 'windows';
const NATIVE_LINUX = 'linux';
const NATIVE_ALL = [NATIVE_MAC, NATIVE_WIN, NATIVE_LINUX];

const MODE_ZIP = 'zip';
const MODE_MAVEN = 'maven';
const MODE_GRADLE = 'gradle';

import {
  SELECT_TYPE,
  SELECT_MODE,
} from './actionTypes'

const config = {
  builds: {
    [BUILD_RELEASE]: {
      title: 'Release',
      description: 'Latest official release',
      job: 'lwjgl_Release',
    },
    [BUILD_STABLE]: {
      title: 'Stable',
      description: 'Beta quality, verified to work',
      job: 'LwjglReleases_NightlyToStable',
    },
    [BUILD_NIGHTLY]: {
      title: 'Nightly',
      description: 'Bleeding edge, possibly broken',
      job: 'lwjgl_Bundle',
    },
  },
  build: null,
  modes: {
    [MODE_ZIP]: "ZIP",
    [MODE_MAVEN]: "Maven",
    [MODE_GRADLE]: "Gradle",
  },
  mode: MODE_ZIP,
};

export default function buildConfigurator(state = config, action) {

  switch ( action.type ) {
    case SELECT_TYPE:
      return { ...state, build: action.build };
    case SELECT_MODE:
      return { ...state, mode: action.mode };
  }

  return state;
}
