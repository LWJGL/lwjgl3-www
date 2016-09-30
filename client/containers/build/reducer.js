import * as $ from './actionTypes'

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

const config = {

  // Domain State

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
  modes: {
    [MODE_ZIP]: "ZIP",
    [MODE_MAVEN]: "Maven",
    [MODE_GRADLE]: "Gradle",
  },

  // UI State

  error: null,
  // build: null,
  build: BUILD_NIGHTLY,
  mode: MODE_ZIP,
  // mode: MODE_MAVEN,
  descriptions: false,
  compact: false,
  hardcoded: false,
  javadoc: false,
  source: false,

};

const getError = (state, message, severity = "danger") => ({...state, error: {message, severity,}});

export default function buildConfigurator(state = config, action) {
  const {type, ...data} = action;

  switch (type) {
    case $.SELECT_TYPE:
      return {...state, ...data};

    case $.SELECT_MODE:
      return {...state, ...data};

    case $.TOGGLE_DESCRIPTIONS:
      return {...state, ...data};

    case $.TOGGLE_COMPACT:
      return {...state, ...data};

    case $.TOGGLE_HARDCODED:
      return {...state, ...data};

    case $.TOGGLE_JAVADOC:
      if ( state.mode !== MODE_ZIP ) {
        // return { ...state, error: getError('Javadoc not available') }
        return getError(state, 'Javadoc not available');
      }
      return {...state, ...data};

    case $.TOGGLE_SOURCE:
      return {...state, ...data};

    case $.ERROR_SET:
      return {...state, ...data};

  }

  return state;
}
