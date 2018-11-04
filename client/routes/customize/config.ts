import lwjgl_300 from './versions/3.0.0';
import lwjgl_310 from './versions/3.1.0';
import lwjgl_311 from './versions/3.1.1';
import lwjgl_312 from './versions/3.1.2';
import lwjgl_313 from './versions/3.1.3';
import lwjgl_314 from './versions/3.1.4';
import lwjgl_315 from './versions/3.1.5';
import lwjgl_316 from './versions/3.1.6';
import lwjgl_320 from './versions/3.2.0';
import lwjgl_nightly from './versions/nightly';
import lwjgl_stable from './versions/stable';

// Types
import {
  BuildStore,
  BuildBindings,
  BuildType,
  Mode,
  Version,
  VersionCollection,
  Binding,
  Preset,
  Native,
  NATIVE_ALL,
  Addon,
  Language,
} from './types';
type BuildBindingsReducer = (opt: BuildBindings) => BuildBindings;

function getDefaultPlatform(): Native {
  if (navigator.platform.indexOf('Mac') > -1 || navigator.platform.indexOf('iP') > -1) {
    return Native.MacOS;
  } else if (navigator.platform.indexOf('Linux') > -1) {
    return Native.Linux;
  }

  return Native.Windows;
}

interface LooseObject {
  [key: string]: any;
}

function getInitialConfig(): BuildStore {
  let config: LooseObject = {
    lwjgl: {},
    builds: {
      byId: {
        [BuildType.Release]: {
          id: BuildType.Release,
          title: 'Release',
          description: 'Latest official release',
        },
        [BuildType.Stable]: {
          id: BuildType.Stable,
          title: 'Stable',
          description: 'Beta quality, verified to work',
        },
        [BuildType.Nightly]: {
          id: BuildType.Nightly,
          title: 'Nightly',
          description: 'Bleeding edge, possibly broken',
        },
      },
      allIds: [BuildType.Release, BuildType.Stable, BuildType.Nightly],
    },
    modes: {
      byId: {
        [Mode.Zip]: {
          id: Mode.Zip,
          title: 'ZIP Bundle',
        },
        [Mode.Maven]: {
          id: Mode.Maven,
          title: 'Maven',
          logo: '/svg/maven.svg',
          file: 'pom.xml',
        },
        [Mode.Gradle]: {
          id: Mode.Gradle,
          title: 'Gradle',
          logo: '/svg/gradle.svg',
          file: 'build.gradle',
        },
        [Mode.Ivy]: {
          id: Mode.Ivy,
          title: 'Ivy',
          logo: '/img/ivy.png',
          file: 'ivy.xml',
        },
      },
      allIds: [Mode.Zip, Mode.Maven, Mode.Gradle, Mode.Ivy],
    },
    natives: {
      byId: {
        [Native.Windows]: {
          id: Native.Windows,
          title: 'Windows',
        },
        [Native.MacOS]: {
          id: Native.MacOS,
          title: 'macOS',
        },
        [Native.Linux]: {
          id: Native.Linux,
          title: 'Linux',
        },
      },
      allIds: NATIVE_ALL,
    },
    languages: {
      byId: {
        [Language.Groovy]: {
          id: Language.Groovy,
          title: 'Groovy',
        },
        [Language.Kotlin]: {
          id: Language.Kotlin,
          title: 'Kotlin',
        },
      },
    },
    presets: {
      byId: {
        [Preset.None]: {
          id: Preset.None,
          title: 'None',
        },
        [Preset.Custom]: {
          id: Preset.Custom,
          title: 'Custom',
        },
        [Preset.All]: {
          id: Preset.All,
          title: 'Everything',
        },
        [Preset.GettingStarted]: {
          id: Preset.GettingStarted,
          title: 'Getting Started',
        },
        [Preset.OpenGL]: {
          id: Preset.OpenGL,
          title: 'Minimal OpenGL',
        },
        [Preset.OpenGLES]: {
          id: Preset.OpenGLES,
          title: 'Minimal OpenGL ES',
        },
        [Preset.Vulkan]: {
          id: Preset.Vulkan,
          title: 'Minimal Vulkan',
        },
      },
    },
    addons: {
      byId: {
        [Addon.JOML]: {
          id: Addon.JOML,
          title: 'JOML',
          description: 'A Java math library for OpenGL rendering calculations.',
          website: 'http://joml-ci.github.io/JOML/',
          maven: {
            groupId: 'org.joml',
            artifactId: 'joml',
            version: '1.9.11',
          },
        },
        [Addon.Steamworks4J]: {
          id: Addon.Steamworks4J,
          title: 'steamworks4j',
          description: 'Access the Steamworks C++ API using Java. Client library, sufficient for most uses.',
          website: 'http://code-disaster.github.io/steamworks4j/',
          maven: {
            groupId: 'com.code-disaster.steamworks4j',
            artifactId: 'steamworks4j',
            version: '1.8.0',
          },
        },
        [Addon.Steamworks4JServer]: {
          id: Addon.Steamworks4JServer,
          title: 'steamworks4j-server',
          description:
            'Access the Steamworks C++ API using Java. Server library, if you need to support game servers or encrypted app tickets.',
          website: 'http://code-disaster.github.io/steamworks4j/',
          maven: {
            groupId: 'com.code-disaster.steamworks4j',
            artifactId: 'steamworks4j-server',
            version: '1.8.0',
          },
        },
        [Addon.LWJGLXDebug]: {
          id: Addon.LWJGLXDebug,
          title: 'LWJGLX/debug',
          description: 'Java Agent for debugging LWJGL3 programs to prevent JVM crashes and resolve OpenGL errors.',
          website: 'https://github.com/LWJGLX/debug',
          modes: [Mode.Zip],
          maven: {
            groupId: 'org.lwjglx',
            artifactId: 'debug',
            version: '1.0.0',
          },
        },
      },
    },

    // UI State

    build: null,
    mode: Mode.Zip,
    preset: Preset.All,
    descriptions: false,
    compact: false,
    hardcoded: false,
    javadoc: true,
    source: true,
    osgi: false,
    includeJSON: true,
    language: Language.Groovy,
    platform: {
      [Native.Windows]: false,
      [Native.MacOS]: false,
      [Native.Linux]: false,
    },
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
  let build: BuildBindings = lwjgl_300();
  build.allIds = Object.keys(build.byId).sort() as Array<Binding>;
  config.lwjgl[build.version] = build;

  // Generate all other LWJGL3 builds using previous build
  [
    lwjgl_310,
    lwjgl_311,
    lwjgl_312,
    lwjgl_313,
    lwjgl_314,
    lwjgl_315,
    lwjgl_316,
    lwjgl_320,
    lwjgl_stable,
    lwjgl_nightly,
  ].reduce((previousBuild: BuildBindings, nextBuildConfig: BuildBindingsReducer) => {
    const build = nextBuildConfig(previousBuild);
    build.allIds = Object.keys(build.byId).sort() as Array<Binding>;
    (config.lwjgl as VersionCollection)[build.alias !== undefined ? build.alias : build.version] = build;
    return build;
  }, build);

  // Versions
  (config.versions as Array<Version>) = (Object.keys(config.lwjgl) as Array<Version>)
    .map(it => (config.lwjgl as VersionCollection)[it])
    .filter((it: BuildBindings) => it.alias === undefined)
    .map((it: BuildBindings) => it.version)
    .reverse();

  config.version = config.versions[0];

  // Fill allIds
  config.presets.allIds = Object.keys(config.presets.byId) as Array<Preset>;
  config.modes.allIds = Object.keys(config.modes.byId) as Array<Mode>;
  config.languages.allIds = Object.keys(config.languages.byId) as Array<Language>;

  config.platform[getDefaultPlatform()] = true;

  return config as BuildStore;
}

export const config: BuildStore = getInitialConfig();
