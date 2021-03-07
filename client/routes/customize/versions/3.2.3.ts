import { Binding, Native, NATIVE_LTE_322, Version } from '../types';
import type { BuildBindings, BindingDefinition } from '../types';

const NATIVE_ALL_323 = [
  Native.Linux,
  Native.LinuxARM64,
  Native.LinuxARM32,
  Native.MacOS,
  Native.Windows,
  Native.WindowsX86,
];

const NATIVE_X86 = [...NATIVE_LTE_322, Native.WindowsX86];

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL323,
  byId: {
    ...prev.byId,
    [Binding.LWJGL]: { ...(prev.byId[Binding.LWJGL] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.ASSIMP]: { ...(prev.byId[Binding.ASSIMP] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.BGFX]: { ...(prev.byId[Binding.BGFX] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.GLFW]: { ...(prev.byId[Binding.GLFW] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.JEMALLOC]: { ...(prev.byId[Binding.JEMALLOC] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.LIBDIVIDE]: { ...(prev.byId[Binding.LIBDIVIDE] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.LLVM]: { ...(prev.byId[Binding.LLVM] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.LMDB]: { ...(prev.byId[Binding.LMDB] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.LZ4]: { ...(prev.byId[Binding.LZ4] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.MEOW]: { ...(prev.byId[Binding.MEOW] as BindingDefinition), natives: [...NATIVE_X86, Native.LinuxARM64] },
    [Binding.NANOVG]: { ...(prev.byId[Binding.NANOVG] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.NFD]: { ...(prev.byId[Binding.NFD] as BindingDefinition), natives: NATIVE_X86 },
    [Binding.NUKLEAR]: { ...(prev.byId[Binding.NUKLEAR] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.OPENAL]: { ...(prev.byId[Binding.OPENAL] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.OPENGL]: { ...(prev.byId[Binding.OPENGL] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.OPENGLES]: { ...(prev.byId[Binding.OPENGLES] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.OPENVR]: { ...(prev.byId[Binding.OPENVR] as BindingDefinition), natives: NATIVE_X86 },
    [Binding.OPUS]: { ...(prev.byId[Binding.OPUS] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.OVR]: { ...(prev.byId[Binding.OVR] as BindingDefinition), natives: [Native.Windows, Native.WindowsX86] },
    [Binding.PAR]: { ...(prev.byId[Binding.PAR] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.REMOTERY]: { ...(prev.byId[Binding.REMOTERY] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.RPMALLOC]: { ...(prev.byId[Binding.RPMALLOC] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.SHADERC]: {
      id: Binding.SHADERC,
      title: 'Shaderc',
      description: 'A collection of libraries for shader compilation.',
      natives: NATIVE_ALL_323,
      website: 'https://github.com/google/shaderc',
    },
    [Binding.SSE]: { ...(prev.byId[Binding.SSE] as BindingDefinition), natives: NATIVE_X86 },
    [Binding.STB]: { ...(prev.byId[Binding.STB] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.TINYEXR]: { ...(prev.byId[Binding.TINYEXR] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.TINYFD]: { ...(prev.byId[Binding.TINYFD] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.TOOTLE]: { ...(prev.byId[Binding.TOOTLE] as BindingDefinition), natives: NATIVE_X86 },
    [Binding.VMA]: { ...(prev.byId[Binding.VMA] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.XXHASH]: { ...(prev.byId[Binding.XXHASH] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.YOGA]: { ...(prev.byId[Binding.YOGA] as BindingDefinition), natives: NATIVE_ALL_323 },
    [Binding.ZSTD]: { ...(prev.byId[Binding.ZSTD] as BindingDefinition), natives: NATIVE_ALL_323 },
  },
});
