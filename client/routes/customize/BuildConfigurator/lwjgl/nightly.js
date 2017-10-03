// @flow
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.1.4',
  alias: 'nightly',
  byId: {
    ...prev.byId,
    'lwjgl-remotery': {
      id: 'lwjgl-remotery',
      title: 'Remotery bindings',
      description:
        'A realtime CPU/GPU profiler hosted in a single C file with a viewer that runs in a web browser.',
      natives: NATIVE_ALL,
      website: 'https://github.com/Celtoys/Remotery',
    },
  },
});
