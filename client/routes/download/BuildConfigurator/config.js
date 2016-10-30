import {
  BUILD_RELEASE,
  BUILD_STABLE,
  BUILD_NIGHTLY,
  NATIVE_MAC,
  NATIVE_WIN,
  NATIVE_LINUX,
  MODE_ZIP,
  MODE_MAVEN,
  MODE_GRADLE,
} from './constants'

const BUILD_ALL = [BUILD_RELEASE, BUILD_STABLE, BUILD_NIGHTLY];
// const BUILD_NEXT = [BUILD_NIGHTLY];

const NATIVE_ALL = [NATIVE_WIN, NATIVE_MAC, NATIVE_LINUX];

const config = {

  // Domain State
  builds: {
    byId: {
      [BUILD_RELEASE]: {
        id: BUILD_RELEASE,
        title: 'Release',
        description: 'Latest official release',
        job: 'lwjgl_Release',
        latest: [3, 1, 0],
      },
      [BUILD_STABLE]: {
        id: BUILD_STABLE,
        title: 'Stable',
        description: 'Beta quality, verified to work',
        job: 'LwjglReleases_NightlyToStable',
        latest: [3, 1, 0],
      },
      [BUILD_NIGHTLY]: {
        id: BUILD_NIGHTLY,
        title: 'Nightly',
        description: 'Bleeding edge, possibly broken',
        job: 'lwjgl_Bundle',
        latest: [3, 1, 0],
      },
    },
    allIds: BUILD_ALL,
  },
  versions: {
    byId: {
      "3.1.0": {
        id: "3.1.0",
        semver: [3, 1, 0]
      },
      "3.0.0": {
        id: "3.0.0",
        semver: [3, 0, 0]
      }
    },
  },
  modes: {
    byId: {
      [MODE_ZIP]: {
        id: MODE_ZIP,
        title: "ZIP Bundle",
      },
      [MODE_MAVEN]: {
        id: MODE_MAVEN,
        title: "Maven",
      },
      [MODE_GRADLE]: {
        id: MODE_GRADLE,
        title: "Gradle",
      },
    },
  },
  natives: {
    byId: {
      [NATIVE_WIN]: {
        id: NATIVE_WIN,
        title: "Windows",
      },
      [NATIVE_MAC]: {
        id: NATIVE_MAC,
        title: "macOS",
      },
      [NATIVE_LINUX]: {
        id: NATIVE_LINUX,
        title: "Linux",
      },
    },
    allIds: NATIVE_ALL
  },
  languages: {
    byId: {
      'groovy': {
        id: 'groovy',
        title: 'Groovy',
      },
      'kotlin': {
        id: 'kotlin',
        title: 'Kotlin',
      }
    }
  },
  artifacts: {
    byId: {
      "lwjgl": {
        id: "lwjgl",
        title: "LWJGL core",
        description: "The LWJGL core library.",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        required: true,
        since: "3.0.0",
      },
      "lwjgl-bgfx": {
        id: "lwjgl-bgfx",
        title: "bgfx bindings",
        description: "A cross-platform, graphics API agnostic rendering library. It provides a high performance, low level abstraction for common platform graphics APIs like OpenGL, Direct3D and Apple Metal.",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.1.0",
      },
      "lwjgl-egl": {
        id: "lwjgl-egl",
        title: "EGL bindings",
        description: "An interface between Khronos rendering APIs such as OpenGL ES or OpenVG and the underlying native platform window system",
        builds: BUILD_ALL,
        since: "3.0.0",
      },
      "lwjgl-glfw": {
        id: "lwjgl-glfw",
        title: "GLFW bindings",
        description: "An multi-platform library for OpenGL, OpenGL ES and Vulkan development on the desktop. It provides a simple API for creating windows, contexts and surfaces, receiving input and events.",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.0.0",
      },
      "lwjgl-jawt": {
        id: "lwjgl-jawt",
        title: "JAWT bindings",
        description: "The AWT native interface",
        builds: BUILD_ALL,
        since: "3.0.0",
      },
      "lwjgl-jemalloc": {
        id: "lwjgl-jemalloc",
        title: "jemalloc bindings",
        description: "A general purpose malloc implementation that emphasizes fragmentation avoidance and scalable concurrency support",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.0.0",
      },
      "lwjgl-lmdb": {
        id: "lwjgl-lmdb",
        title: "LMDB bindings",
        description: "A compact, fast, powerful, and robust database that implements a simplified variant of the BerkeleyDB (BDB) API",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.1.0",
      },
      "lwjgl-nanovg": {
        id: "lwjgl-nanovg",
        title: "NanoVG bindings",
        description: "A small antialiased vector graphics rendering library for OpenGL",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.0.0",
      },
      "lwjgl-nfd": {
        id: "lwjgl-nfd",
        title: "Native File Dialog bindings",
        description: "A tiny, neat C library that portably invokes native file open and save dialogs",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.0.0",
      },
      "lwjgl-nuklear": {
        id: "lwjgl-nuklear",
        title: "Nuklear bindings",
        description: "A minimal state immediate mode graphical user interface toolkit",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.1.0",
      },
      "lwjgl-openal": {
        id: "lwjgl-openal",
        title: "OpenAL bindings",
        description: "A cross-platform 3D audio API appropriate for use with gaming applications and many other types of audio applications",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.0.0",
      },
      "lwjgl-opencl": {
        id: "lwjgl-opencl",
        title: "OpenCL bindings",
        description: "An open, royalty-free standard for cross-platform, parallel programming of diverse processors found in personal computers, servers, mobile devices and embedded platforms",
        builds: BUILD_ALL,
        since: "3.0.0",
      },
      "lwjgl-opengl": {
        id: "lwjgl-opengl",
        title: "OpenGL bindings",
        description: "The most widely adopted 2D and 3D graphics API in the industry, bringing thousands of applications to a wide variety of computer platforms",
        builds: BUILD_ALL,
        since: "3.0.0",
      },
      "lwjgl-opengles": {
        id: "lwjgl-opengles",
        title: "OpenGL ES bindings",
        description: "A royalty-free, cross-platform API for full-function 2D and 3D graphics on embedded systems - including consoles, phones, appliances and vehicles",
        builds: BUILD_ALL,
        since: "3.0.0",
      },
      "lwjgl-ovr": {
        id: "lwjgl-ovr",
        title: "OVR bindings",
        description: "The API of the Oculus SDK",
        builds: BUILD_ALL,
        natives: [NATIVE_WIN],
        since: "3.0.0",
      },
      "lwjgl-par": {
        id: "lwjgl-par",
        title: "par_shapes bindings",
        description: "Generate parametric surfaces and other simple shapes",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.0.0",
      },
      "lwjgl-sse": {
        id: "lwjgl-sse",
        title: "SSE bindings",
        description: "Simple SSE intrinsics",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.0.0",
      },
      "lwjgl-stb": {
        id: "lwjgl-stb",
        title: "stb bindings",
        description: "Single-file public domain libraries for fonts, images, ogg vorbis files and more.",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.0.0",
      },
      "lwjgl-tinyfd": {
        id: "lwjgl-tinyfd",
        title: "Tiny File Dialogs bindings",
        description: "Provides basic modal dialogs.",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.1.0",
      },
      "lwjgl-vulkan": {
        id: "lwjgl-vulkan",
        title: "Vulkan bindings",
        description: "A new generation graphics and compute API that provides high-efficiency, cross-platform access to modern GPUs used in a wide variety of devices from PCs and consoles to mobile phones and embedded platforms.",
        builds: BUILD_ALL,
        since: "3.0.0",
      },
      "lwjgl-xxhash": {
        id: "lwjgl-xxhash",
        title: "xxHash bindings",
        description: "An Extremely fast Hash algorithm, running at RAM speed limits.",
        builds: BUILD_ALL,
        natives: NATIVE_ALL,
        since: "3.0.0",
      },
    },
  },
  presets: {
    byId: {
      "none": {
        id: "none",
        title: "None",
        artifacts: [
          'lwjgl'
        ]
      },
      "custom": {
        id: "custom",
        title: "Custom",
      },
      "all": {
        id: "all",
        title: "Everything",
      },
      "getting-started": {
        id: "getting-started",
        title: "Getting Started",
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
        ]
      },
      "minimal-opengl": {
        id: "minimal-opengl",
        title: "Minimal OpenGL",
        artifacts: [
          'lwjgl',
          'lwjgl-glfw',
          'lwjgl-jemalloc',
          'lwjgl-openal',
          'lwjgl-opengl',
          'lwjgl-stb',
        ]
      },
      "minimal-opengles": {
        id: "minimal-opengles",
        title: "Minimal OpenGL ES",
        artifacts: [
          'lwjgl',
          'lwjgl-egl',
          'lwjgl-glfw',
          'lwjgl-jemalloc',
          'lwjgl-openal',
          'lwjgl-opengles',
          'lwjgl-stb',
        ]
      },
      "minimal-vulkan": {
        id: "",
        title: "Minimal Vulkan",
        artifacts: [
          'lwjgl',
          'lwjgl-glfw',
          'lwjgl-jemalloc',
          'lwjgl-openal',
          'lwjgl-stb',
          'lwjgl-vulkan',
        ]
      },
    },
  },

  // UI State

  // error: null,
  build: null,
  mode: MODE_ZIP,
  preset: 'all',
  descriptions: false,
  compact: false,
  hardcoded: false,
  javadoc: true,
  source: true,
  language: null,
  platform: {},
  version: null,
  downloading: false,
  progress: [],
};

function getDefaultPlatform() {
  if ( process.browser ) {
    if ( navigator.platform.indexOf('Mac') > -1 || navigator.platform.indexOf('iP') > -1 ) {
      return 'macos';
    } else if ( navigator.platform.indexOf('Linux') > -1 ) {
      return 'linux';
    }
  }

  return 'windows';
}

config.modes.allIds = Object.keys(config.modes.byId);
config.versions.allIds = Object.keys(config.versions.byId);
config.artifacts.allIds = Object.keys(config.artifacts.byId);
config.languages.allIds = Object.keys(config.languages.byId);

config.presets.byId.all.artifacts = config.artifacts.allIds.filter(artifact => config.artifacts.byId[artifact].until === undefined).map(artifact => artifact);
config.presets.allIds = Object.keys(config.presets.byId);

config.language = config.languages.allIds[0];
config.version = config.versions.allIds[0];

config.natives.allIds.forEach(platform => {
  config.platform[platform] = false;
});
config.platform[getDefaultPlatform()] = true;

config.contents = {};

// Fill content map with artifacts
config.artifacts.allIds.forEach(artifact => {
  config.contents[artifact] = false;
});

// Toggle preset artifacts on
config.presets.byId[config.preset].artifacts.forEach(artifact => {
  config.contents[artifact] = true;
});

export default config;
