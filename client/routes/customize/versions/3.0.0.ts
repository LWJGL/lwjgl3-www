import { BuildBindings, Version, Binding, Preset, Native, NATIVE_ALL } from '../types';

export default (): BuildBindings => ({
  version: Version.LWJGL300,
  allIds: [],
  byId: {
    [Binding.LWJGL]: {
      id: Binding.LWJGL,
      title: 'LWJGL core',
      description: 'The LWJGL core library.',
      natives: NATIVE_ALL,
      required: true,
      presets: [Preset.None, Preset.GettingStarted, Preset.OpenGL, Preset.OpenGLES, Preset.Vulkan],
    },
    [Binding.EGL]: {
      id: Binding.EGL,
      title: 'EGL',
      description:
        'An interface between Khronos rendering APIs such as OpenGL ES or OpenVG and the underlying native platform window system.',
      website: 'https://www.khronos.org/egl',
      presets: [Preset.OpenGLES],
    },
    [Binding.GLFW]: {
      id: Binding.GLFW,
      title: 'GLFW',
      description:
        'A multi-platform library for OpenGL, OpenGL ES and Vulkan development on the desktop. It provides a simple API for creating windows, contexts and surfaces, receiving input and events.',
      natives: NATIVE_ALL,
      website: 'http://www.glfw.org/',
      presets: [Preset.GettingStarted, Preset.OpenGL, Preset.OpenGLES, Preset.Vulkan],
    },
    [Binding.JAWT]: {
      id: Binding.JAWT,
      title: 'JAWT',
      description: 'The AWT native interface.',
      website: 'https://docs.oracle.com/javase/8/docs/technotes/guides/awt/AWT_Native_Interface.html',
    },
    [Binding.Jemalloc]: {
      id: Binding.Jemalloc,
      title: 'jemalloc',
      description:
        'A general purpose malloc implementation that emphasizes fragmentation avoidance and scalable concurrency support.',
      natives: NATIVE_ALL,
      website: 'http://jemalloc.net/',
    },
    [Binding.NanoSVG]: {
      id: Binding.NanoSVG,
      title: 'NanoVG & NanoSVG',
      description:
        'A small antialiased vector graphics rendering library for OpenGL. Also includes <a href="https://github.com/memononen/nanosvg">NanoSVG</a>, a simple SVG parser (3.1.4+).',
      natives: NATIVE_ALL,
      website: 'https://github.com/memononen/nanovg',
      presets: [Preset.GettingStarted],
    },
    [Binding.Nfd]: {
      id: Binding.Nfd,
      title: 'Native File Dialog',
      description: 'A tiny, neat C library that portably invokes native file open and save dialogs.',
      natives: NATIVE_ALL,
      website: 'https://github.com/mlabbe/nativefiledialog',
    },
    [Binding.OpenAL]: {
      id: Binding.OpenAL,
      title: 'OpenAL',
      description:
        'A cross-platform 3D audio API appropriate for use with gaming applications and many other types of audio applications.',
      natives: NATIVE_ALL,
      website: 'https://www.openal.org/',
      presets: [Preset.GettingStarted, Preset.OpenGL, Preset.OpenGLES, Preset.Vulkan],
    },
    [Binding.OpenCL]: {
      id: Binding.OpenCL,
      title: 'OpenCL',
      description:
        'An open, royalty-free standard for cross-platform, parallel programming of diverse processors found in personal computers, servers, mobile devices and embedded platforms.',
      website: 'https://www.khronos.org/opencl/',
    },
    [Binding.OpenGL]: {
      id: Binding.OpenGL,
      title: 'OpenGL',
      description:
        'The most widely adopted 2D and 3D graphics API in the industry, bringing thousands of applications to a wide variety of computer platforms.',
      website: 'https://www.opengl.org/',
      presets: [Preset.GettingStarted, Preset.OpenGL],
    },
    [Binding.OpenGLES]: {
      id: Binding.OpenGLES,
      title: 'OpenGL ES',
      description:
        'A royalty-free, cross-platform API for full-function 2D and 3D graphics on embedded systems - including consoles, phones, appliances and vehicles.',
      website: 'https://www.khronos.org/opengles/',
      presets: [Preset.OpenGLES],
    },
    [Binding.OVR]: {
      id: Binding.OVR,
      title: 'OVR',
      description: 'The API of the Oculus SDK.',
      natives: [Native.Windows],
      website: 'https://developer.oculus.com/',
    },
    [Binding.ParShapes]: {
      id: Binding.ParShapes,
      title: 'par_shapes',
      description: 'Generate parametric surfaces and other simple shapes.',
      natives: NATIVE_ALL,
      website: 'http://github.prideout.net/shapes',
      presets: [Preset.GettingStarted],
    },
    [Binding.SSE]: {
      id: Binding.SSE,
      title: 'SSE',
      description: 'Simple SSE intrinsics.',
      natives: NATIVE_ALL,
      website: 'https://software.intel.com/en-us/node/523328',
    },
    [Binding.Stb]: {
      id: Binding.Stb,
      title: 'stb',
      description: 'Single-file public domain libraries for fonts, images, ogg vorbis files and more.',
      natives: NATIVE_ALL,
      website: 'https://github.com/nothings/stb',
      presets: [Preset.GettingStarted, Preset.OpenGL, Preset.OpenGLES, Preset.Vulkan],
    },
    [Binding.Vulkan]: {
      id: Binding.Vulkan,
      title: 'Vulkan',
      description:
        'A new generation graphics and compute API that provides high-efficiency, cross-platform access to modern GPUs used in a wide variety of devices from PCs and consoles to mobile phones and embedded platforms.',
      website: 'https://www.khronos.org/vulkan/',
      presets: [Preset.GettingStarted, Preset.Vulkan],
    },
    [Binding.XxHash]: {
      id: Binding.XxHash,
      title: 'xxHash',
      description: 'An Extremely fast Hash algorithm, running at RAM speed limits.',
      natives: NATIVE_ALL,
      website: 'http://www.xxhash.com/',
    },
  },
});
