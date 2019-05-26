import { BuildBindings, Version, Binding, NATIVE_NO_ARM } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL315,
  byId: {
    ...prev.byId,
    [Binding.TOOTLE]: {
      id: Binding.TOOTLE,
      title: 'AMD Tootle',
      description:
        'AMD Tootle (Triangle Order Optimization Tool) is a 3D triangle mesh optimization library that improves on existing mesh preprocessing techniques.',
      natives: NATIVE_NO_ARM,
      website: 'https://github.com/GPUOpen-Tools/amd-tootle',
    },
  },
});
