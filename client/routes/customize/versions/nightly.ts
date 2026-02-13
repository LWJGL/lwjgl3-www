import { BuildBindings, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL342,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
  },
});
