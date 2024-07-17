import { BuildBindings, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL334,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
  },
});
