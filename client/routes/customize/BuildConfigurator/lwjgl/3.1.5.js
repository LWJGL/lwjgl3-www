// @flow
import { NATIVE_ALL } from '../constants';
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.1.5',
  byId: {
    ...prev.byId,
    'lwjgl-tootle': {
      id: 'lwjgl-tootle',
      title: 'AMD Tootle bindings',
      description:
        'AMD Tootle (Triangle Order Optimization Tool) is a 3D triangle mesh optimization library that improves on existing mesh preprocessing techniques.',
      natives: NATIVE_ALL,
      website: 'https://github.com/GPUOpen-Tools/amd-tootle',
    },
  },
});
