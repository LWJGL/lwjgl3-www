// @flow
import {
  BUILD_RELEASE,
  BUILD_STABLE,
  BUILD_NIGHTLY,
  NATIVE_MAC,
  NATIVE_WIN,
  NATIVE_LINUX,
  NATIVE_ALL,
  MODE_ZIP,
  MODE_MAVEN,
  MODE_GRADLE,
  MODE_IVY,
} from './constants';

import lwjgl_300 from './lwjgl/3.0.0';
import lwjgl_310 from './lwjgl/3.1.0';
import lwjgl_311 from './lwjgl/3.1.1';
import lwjgl_312 from './lwjgl/3.1.2';
import lwjgl_313 from './lwjgl/3.1.3';
import lwjgl_stable from './lwjgl/stable';
import lwjgl_nightly from './lwjgl/nightly';

import type { BuildConfig, BuildOptions, BuildOptionsBuilder } from './types';

function getDefaultPlatform() {
  if (navigator.platform.indexOf('Mac') > -1 || navigator.platform.indexOf('iP') > -1) {
    return 'macos';
  } else if (navigator.platform.indexOf('Linux') > -1) {
    return 'linux';
  }

  return 'windows';
}

const config: BuildConfig = {
  lwjgl: {},
  builds: {
    byId: {
      [BUILD_RELEASE]: {
        id: BUILD_RELEASE,
        title: 'Release',
        description: 'Latest official release',
        status: null,
      },
      [BUILD_STABLE]: {
        id: BUILD_STABLE,
        title: 'Stable',
        description: 'Beta quality, verified to work',
        status: null,
      },
      [BUILD_NIGHTLY]: {
        id: BUILD_NIGHTLY,
        title: 'Nightly',
        description: 'Bleeding edge, possibly broken',
        status: null,
      },
    },
    allIds: [BUILD_RELEASE, BUILD_STABLE, BUILD_NIGHTLY],
  },
  modes: {
    byId: {
      [MODE_ZIP]: {
        id: MODE_ZIP,
        title: 'ZIP Bundle',
      },
      [MODE_MAVEN]: {
        id: MODE_MAVEN,
        title: 'Maven',
        logo: '/svg/maven.svg',
        file: 'pom.xml',
      },
      [MODE_GRADLE]: {
        id: MODE_GRADLE,
        title: 'Gradle',
        logo: '/svg/gradle.svg',
        file: 'build.gradle',
      },
      [MODE_IVY]: {
        id: MODE_IVY,
        title: 'Ivy',
        logo: '/img/ivy.png',
        file: 'ivy.xml',
      },
    },
    allIds: [],
  },
  natives: {
    byId: {
      [NATIVE_WIN]: {
        id: NATIVE_WIN,
        title: 'Windows',
      },
      [NATIVE_MAC]: {
        id: NATIVE_MAC,
        title: 'macOS',
      },
      [NATIVE_LINUX]: {
        id: NATIVE_LINUX,
        title: 'Linux',
      },
    },
    allIds: NATIVE_ALL,
  },
  languages: {
    byId: {
      groovy: {
        id: 'groovy',
        title: 'Groovy',
      },
      kotlin: {
        id: 'kotlin',
        title: 'Kotlin',
      },
    },
    allIds: [],
  },
  presets: {
    byId: {
      none: {
        id: 'none',
        title: 'None',
        artifacts: ['lwjgl'],
      },
      custom: {
        id: 'custom',
        title: 'Custom',
      },
      all: {
        id: 'all',
        title: 'Everything',
      },
      'getting-started': {
        id: 'getting-started',
        title: 'Getting Started',
        artifacts: [
          'lwjgl',
          'lwjgl-glfw',
          'lwjgl-jemalloc',
          'lwjgl-nanovg',
          'lwjgl-nfd',
          'lwjgl-nuklear',
          'lwjgl-openal',
          'lwjgl-opengl',
          'lwjgl-par',
          'lwjgl-stb',
          'lwjgl-tinyfd',
          'lwjgl-vulkan',
        ],
      },
      'minimal-opengl': {
        id: 'minimal-opengl',
        title: 'Minimal OpenGL',
        artifacts: ['lwjgl', 'lwjgl-glfw', 'lwjgl-jemalloc', 'lwjgl-openal', 'lwjgl-opengl', 'lwjgl-stb'],
      },
      'minimal-opengles': {
        id: 'minimal-opengles',
        title: 'Minimal OpenGL ES',
        artifacts: [
          'lwjgl',
          'lwjgl-egl',
          'lwjgl-glfw',
          'lwjgl-jemalloc',
          'lwjgl-openal',
          'lwjgl-opengles',
          'lwjgl-stb',
        ],
      },
      'minimal-vulkan': {
        id: 'minimal-vulkan',
        title: 'Minimal Vulkan',
        artifacts: ['lwjgl', 'lwjgl-glfw', 'lwjgl-jemalloc', 'lwjgl-openal', 'lwjgl-stb', 'lwjgl-vulkan'],
      },
    },
    allIds: [],
  },
  addons: {
    byId: {
      joml: {
        id: 'joml',
        title: 'JOML',
        description: 'A Java math library for OpenGL rendering calculations.',
        website: 'http://joml-ci.github.io/JOML/',
        maven: {
          groupId: 'org.joml',
          artifactId: 'joml',
          version: '1.9.6',
        },
      },
      steamworks4j: {
        id: 'steamworks4j',
        title: 'steamworks4j',
        description: 'A library that allows Java applications to access the Steamworks C++ API.',
        website: 'http://code-disaster.github.io/steamworks4j/',
        maven: {
          groupId: 'com.code-disaster.steamworks4j',
          artifactId: 'steamworks4j',
          version: '1.6.2',
        },
      },
      'lwjglx-debug': {
        id: 'lwjglx-debug',
        title: 'LWJGLX/debug',
        description: 'Java Agent for debugging LWJGL3 programs to prevent JVM crashes and resolve OpenGL errors.',
        website: 'https://github.com/LWJGLX/debug',
        modes: [MODE_ZIP],
        maven: {
          groupId: 'org.lwjglx',
          artifactId: 'debug',
          version: '1.0.0',
        },
      },
    },
    allIds: ['joml', 'lwjglx-debug', 'steamworks4j'],
  },

  // UI State

  build: null,
  mode: MODE_ZIP,
  preset: 'all',
  descriptions: false,
  compact: false,
  hardcoded: false,
  javadoc: true,
  source: true,
  osgi: false,
  language: '',
  platform: {},
  versions: [],
  version: '',
  contents: {},
  availability: {},
  selectedAddons: [],
  artifacts: {
    version: '',
    byId: {},
    allIds: [],
  },
};

// Generate first LWJGL3 build
let build: BuildOptions = lwjgl_300();
build.allIds = Object.keys(build.byId).sort();
config.lwjgl[build.version] = build;

// Generate all other LWJGL3 builds using previous build
const builders: Array<BuildOptionsBuilder> = [lwjgl_310, lwjgl_311, lwjgl_312, lwjgl_313, lwjgl_stable, lwjgl_nightly];
builders.reduce((previousBuild: BuildOptions, nextBuildConfig: BuildOptionsBuilder) => {
  const build = nextBuildConfig(previousBuild);
  build.allIds = Object.keys(build.byId).sort();
  config.lwjgl[build.alias || build.version] = build;
  return build;
}, build);

config.versions = Object.keys(config.lwjgl)
  .map((it: string) => config.lwjgl[it])
  .filter((it: BuildOptions) => it.alias === undefined)
  .map((it: BuildOptions) => it.version)
  .reverse();
config.version = config.versions[0];

// Fill allIds
config.presets.allIds = Object.keys(config.presets.byId);
// $FlowFixMe
config.modes.allIds = Object.keys(config.modes.byId);
// $FlowFixMe
config.languages.allIds = Object.keys(config.languages.byId);

if (config.languages.allIds && config.languages.allIds.length) {
  config.language = config.languages.allIds[0];
}

config.natives.allIds.forEach(platform => {
  config.platform[platform] = false;
});

config.platform[getDefaultPlatform()] = true;

export default config;
