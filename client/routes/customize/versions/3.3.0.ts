import { Binding, NATIVE_LTE_322, NATIVE_LTE_333, Native, Version } from '../types';
import type { BuildBindings, BindingDefinition } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL330,
  byId: {
    ...prev.byId,
    [Binding.LWJGL]: { ...(prev.byId[Binding.LWJGL] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.ASSIMP]: { ...(prev.byId[Binding.ASSIMP] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.BGFX]: {
      ...(prev.byId[Binding.BGFX] as BindingDefinition),
      natives: [...NATIVE_LTE_322, Native.LinuxARM32, Native.LinuxARM64, Native.MacOSARM64, Native.WindowsX86],
    },
    [Binding.GLFW]: { ...(prev.byId[Binding.GLFW] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.JEMALLOC]: { ...(prev.byId[Binding.JEMALLOC] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.LIBDIVIDE]: { ...(prev.byId[Binding.LIBDIVIDE] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.LLVM]: { ...(prev.byId[Binding.LLVM] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.LMDB]: { ...(prev.byId[Binding.LMDB] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.LZ4]: { ...(prev.byId[Binding.LZ4] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.MEOW]: {
      ...(prev.byId[Binding.MEOW] as BindingDefinition),
      natives: [...NATIVE_LTE_322, Native.LinuxARM64, Native.MacOSARM64, Native.WindowsX86, Native.WindowsARM64],
    },
    [Binding.MESHOPTIMIZER]: {
      id: Binding.MESHOPTIMIZER,
      title: 'meshoptimizer',
      description: 'A mesh optimization library that makes meshes smaller and faster to render.',
      natives: NATIVE_LTE_333,
      website: 'https://github.com/zeux/meshoptimizer',
    },
    [Binding.NANOVG]: { ...(prev.byId[Binding.NANOVG] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.NFD]: { ...(prev.byId[Binding.NFD] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.NUKLEAR]: { ...(prev.byId[Binding.NUKLEAR] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.OPENAL]: { ...(prev.byId[Binding.OPENAL] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.OPENGL]: { ...(prev.byId[Binding.OPENGL] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.OPENGLES]: { ...(prev.byId[Binding.OPENGLES] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.OPUS]: { ...(prev.byId[Binding.OPUS] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.PAR]: { ...(prev.byId[Binding.PAR] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.REMOTERY]: {
      ...(prev.byId[Binding.REMOTERY] as BindingDefinition),
      natives: [...NATIVE_LTE_322, Native.LinuxARM32, Native.LinuxARM64, Native.MacOSARM64, Native.WindowsX86],
    },
    [Binding.RPMALLOC]: { ...(prev.byId[Binding.RPMALLOC] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.SHADERC]: { ...(prev.byId[Binding.SHADERC] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.SPVC]: {
      id: Binding.SPVC,
      title: 'SPIRV-Cross',
      description:
        'A library for performing reflection on SPIR-V and disassembling SPIR-V back to high level languages.',
      natives: NATIVE_LTE_333,
      website: 'https://github.com/KhronosGroup/SPIRV-Cross',
    },
    [Binding.STB]: { ...(prev.byId[Binding.STB] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.TINYEXR]: { ...(prev.byId[Binding.TINYEXR] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.TINYFD]: { ...(prev.byId[Binding.TINYFD] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.VMA]: { ...(prev.byId[Binding.VMA] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.VULKAN]: {
      ...(prev.byId[Binding.VULKAN] as BindingDefinition),
      natives: [Native.MacOS, Native.MacOSARM64],
    },
    [Binding.XXHASH]: { ...(prev.byId[Binding.XXHASH] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.YOGA]: { ...(prev.byId[Binding.YOGA] as BindingDefinition), natives: NATIVE_LTE_333 },
    [Binding.ZSTD]: { ...(prev.byId[Binding.ZSTD] as BindingDefinition), natives: NATIVE_LTE_333 },
  },
});
