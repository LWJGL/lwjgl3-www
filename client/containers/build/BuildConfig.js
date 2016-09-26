const BUILD_RELEASE = 'release';
const BUILD_STABLE = 'stable';
const BUILD_NIGHTLY = 'nightly';
const BUILD_ALL = [BUILD_RELEASE, BUILD_STABLE, BUILD_NIGHTLY];

const NATIVE_MAC = 'macos';
const NATIVE_WIN = 'windows';
const NATIVE_LINUX = 'linux';
const NATIVE_ALL = [NATIVE_MAC, NATIVE_WIN, NATIVE_LINUX];

const config = {

  "natives": NATIVE_ALL,

  "versions": [
    [3, 0, 1],
    [3, 0, 0],
  ],

  "builds": {
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

  "artifacts": [
    {
      id: "lwjgl",
      name: "LWJGL core",
      description: "The LWJGL core library.",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      required: true,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-egl",
      name: "EGL bindings",
      description: "An interface between Khronos rendering APIs such as OpenGL ES or OpenVG and the underlying native platform window system",
      builds: BUILD_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-glfw",
      name: "GLFW bindings",
      description: "An multi-platform library for OpenGL, OpenGL ES and Vulkan development on the desktop. It provides a simple API for creating windows, contexts and surfaces, receiving input and events.",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-jawt",
      name: "JAWT bindings",
      description: "The AWT native interface",
      builds: BUILD_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-jemalloc",
      name: "jemalloc bindings",
      description: "A general purpose malloc implementation that emphasizes fragmentation avoidance and scalable concurrency support",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-lmdb",
      name: "LMDB bindings",
      description: "A compact, fast, powerful, and robust database that implements a simplified variant of the BerkeleyDB (BDB) API",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-nanovg",
      name: "NanoVG bindings",
      description: "A small antialiased vector graphics rendering library for OpenGL",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-nfd",
      name: "Native File Dialog bindings",
      description: "A tiny, neat C library that portably invokes native file open and save dialogs",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-nuklear",
      name: "Nuklear bindings",
      description: "A minimal state immediate mode graphical user interface toolkit",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-openal",
      name: "OpenAL bindings",
      description: "A cross-platform 3D audio API appropriate for use with gaming applications and many other types of audio applications",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-opencl",
      name: "OpenCL bindings",
      description: "An open, royalty-free standard for cross-platform, parallel programming of diverse processors found in personal computers, servers, mobile devices and embedded platforms",
      builds: BUILD_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-opengl",
      name: "OpenGL bindings",
      description: "The most widely adopted 2D and 3D graphics API in the industry, bringing thousands of applications to a wide variety of computer platforms",
      builds: BUILD_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-opengles",
      name: "OpenGL ES bindings",
      description: "A royalty-free, cross-platform API for full-function 2D and 3D graphics on embedded systems - including consoles, phones, appliances and vehicles",
      builds: BUILD_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-ovr",
      name: "OVR bindings",
      description: "The API of the Oculus SDK",
      builds: BUILD_ALL,
      natives: [NATIVE_WIN],
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-par",
      name: "par_shapes bindings",
      description: "Generate parametric surfaces and other simple shapes",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-sse",
      name: "SSE bindings",
      description: "Simple SSE intrinsics",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-stb",
      name: "stb bindings",
      description: "Single-file public domain libraries for fonts, images, ogg vorbis files and more.",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-tinyfd",
      name: "Tiny File Dialogs bindings",
      description: "Provides basic modal dialogs.",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-vulkan",
      name: "Vulkan bindings",
      description: "A new generation graphics and compute API that provides high-efficiency, cross-platform access to modern GPUs used in a wide variety of devices from PCs and consoles to mobile phones and embedded platforms.",
      builds: BUILD_ALL,
      since: [3, 0, 1],
    },
    {
      id: "lwjgl-xxhash",
      name: "xxHash bindings",
      description: "An Extremely fast Hash algorithm, running at RAM speed limits.",
      builds: BUILD_ALL,
      natives: NATIVE_ALL,
      since: [3, 0, 1],
    },

  ],

  "presets": {

    "none": [
      'lwjgl'
    ],

    "getting-started": [
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
      'lwjgl-tinyfd', // nfd & tinyfd do the same thing, nfd may be deprecated in the future
      'lwjgl-vulkan',
    ],

    "minimal-opengl": [
      'lwjgl',
      'lwjgl-glfw',
      'lwjgl-jemalloc',
      'lwjgl-openal',
      'lwjgl-opengl',
      'lwjgl-stb',
    ],

    "minimal-opengles": [
      'lwjgl',
      'lwjgl-egl',
      'lwjgl-glfw',
      'lwjgl-jemalloc',
      'lwjgl-openal',
      'lwjgl-opengles',
      'lwjgl-stb',
    ],

    "minimal-vulkan": [
      'lwjgl',
      'lwjgl-glfw',
      'lwjgl-jemalloc',
      'lwjgl-openal',
      'lwjgl-stb',
      'lwjgl-vulkan',
    ],

  },

};

config.index = {};
config.artifacts.forEach((artifact, index) => {
  config.index[artifact.id] = index;
});

config.presets.all = config.artifacts.filter(artifact => artifact.until === undefined).map(artifact => artifact.id);

export default config;