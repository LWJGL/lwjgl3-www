import lwjgl_300 from './versions/3.0.0';
import lwjgl_310 from './versions/3.1.0';
import lwjgl_311 from './versions/3.1.1';
import lwjgl_312 from './versions/3.1.2';
import lwjgl_313 from './versions/3.1.3';
import lwjgl_314 from './versions/3.1.4';
import lwjgl_315 from './versions/3.1.5';
import lwjgl_316 from './versions/3.1.6';
import lwjgl_320 from './versions/3.2.0';
import lwjgl_321 from './versions/3.2.1';
import lwjgl_322 from './versions/3.2.2';
import lwjgl_323 from './versions/3.2.3';
import lwjgl_nightly from './versions/nightly';
import { Native, BuildType, Mode, Version, Language, Preset, NATIVE_ALL, Addon } from './types';

// Types
import type { BuildStore, BuildStoreSnapshot, BuildBindings, Binding } from './types';
type BuildBindingsReducer = (opt: BuildBindings) => BuildBindings;

export function getDefaultPlatform(): Native {
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
          description: '“Latest stable build”',
        },
        [BuildType.Nightly]: {
          id: BuildType.Nightly,
          title: 'Early Access',
          description: '“Snapshot build, possibly broken”',
        },
      },
      allIds: [BuildType.Release, BuildType.Nightly],
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
        [Native.Linux]: {
          id: Native.Linux,
          title: 'Linux x64',
          since: Version.LWJGL300,
        },
        [Native.LinuxARM64]: {
          id: Native.LinuxARM64,
          title: 'Linux arm64',
          since: Version.LWJGL323,
        },
        [Native.LinuxARM32]: {
          id: Native.LinuxARM32,
          title: 'Linux arm32',
          since: Version.LWJGL323,
        },
        [Native.MacOS]: {
          id: Native.MacOS,
          title: 'macOS x64',
          since: Version.LWJGL300,
        },
        [Native.MacOSARM64]: {
          id: Native.MacOSARM64,
          title: 'macOS arm64',
          since: Version.LWJGL330,
        },
        [Native.Windows]: {
          id: Native.Windows,
          title: 'Windows x64',
          since: Version.LWJGL300,
        },
        [Native.WindowsX86]: {
          id: Native.WindowsX86,
          title: 'Windows x86',
          since: Version.LWJGL323,
        },
        [Native.WindowsARM64]: {
          id: Native.WindowsARM64,
          title: 'Windows arm64',
          since: Version.LWJGL330,
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
            version: '1.10.2',
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
        [Addon.LWJGLXLWJGL3Awt]: {
          id: Addon.LWJGLXLWJGL3Awt,
          title: 'LWJGLX/lwjgl3-awt',
          description: 'OpenGL and Vulkan support for AWT with LWJGL 3.',
          website: 'https://github.com/LWJGLX/lwjgl3-awt',
          maven: {
            groupId: 'org.lwjglx',
            artifactId: 'lwjgl3-awt',
            version: '0.1.8',
          },
        },
        [Addon.Steamworks4J]: {
          id: Addon.Steamworks4J,
          title: 'steamworks4j',
          description: 'Access the Steamworks C++ API using Java. Client library, sufficient for most uses.',
          website: 'https://code-disaster.github.io/steamworks4j/',
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
          website: 'https://code-disaster.github.io/steamworks4j/',
          maven: {
            groupId: 'com.code-disaster.steamworks4j',
            artifactId: 'steamworks4j-server',
            version: '1.8.0',
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
      [Native.Linux]: false,
      [Native.LinuxARM64]: false,
      [Native.LinuxARM32]: false,
      [Native.MacOS]: false,
      [Native.MacOSARM64]: false,
      [Native.Windows]: false,
      [Native.WindowsX86]: false,
      [Native.WindowsARM64]: false,
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
    lwjgl_321,
    lwjgl_322,
    lwjgl_323,
    lwjgl_nightly,
  ].reduce((previousBuild: BuildBindings, nextBuildConfig: BuildBindingsReducer) => {
    const build = nextBuildConfig(previousBuild);
    build.allIds = Object.keys(build.byId).sort() as Array<Binding>;
    config.lwjgl[build.alias !== undefined ? build.alias : build.version] = build;
    return build;
  }, build);

  // Versions
  config.versions = Object.keys(config.lwjgl)
    .map((it) => config.lwjgl[it])
    .filter((it: BuildBindings) => it.alias === undefined)
    .map((it: BuildBindings) => it.version)
    .reverse();

  config.version = config.versions[0];

  // Populate allIds
  config.presets.allIds = Object.keys(config.presets.byId);
  config.modes.allIds = Object.keys(config.modes.byId);
  config.languages.allIds = Object.keys(config.languages.byId);
  config.addons.allIds = Object.keys(config.addons.byId);

  config.platform[getDefaultPlatform()] = true;

  return config as BuildStore;
}

export const config: BuildStore = getInitialConfig();

function keepChecked(src: { [key: string]: boolean | undefined }) {
  // Keep only checked items to avoid phantom selections
  // when new items (bindings,addons,platforms) are added
  return Object.keys(src).filter((key) => src[key] === true);
}

export function getConfigSnapshot(state: BuildStore): BuildStoreSnapshot | null {
  if (state.build === null) {
    return null;
  }

  const save: BuildStoreSnapshot = {
    build: state.build,
    mode: state.mode,
    selectedAddons: state.selectedAddons,
    platform: keepChecked(state.platform) as Array<Native>,
    descriptions: state.descriptions,
    compact: state.compact,
    hardcoded: state.hardcoded,
    javadoc: state.javadoc,
    includeJSON: state.includeJSON,
    source: state.source,
    osgi: state.osgi,
    language: state.language,
  };

  if (state.preset === Preset.Custom) {
    save.contents = keepChecked(state.contents) as Array<Binding>;
  } else {
    save.preset = state.preset;
  }
  if (state.build === BuildType.Release) {
    save.version = state.version;
    save.versionLatest = state.versions[0];
  }

  return save;
}

export function configJSONfilename(save: BuildStoreSnapshot) {
  return `lwjgl-${save.build}-${save.preset != null ? save.preset : 'custom'}-${save.mode}.json`;
}

export const OSGiVersionMax: Version = Version.LWJGL321;
