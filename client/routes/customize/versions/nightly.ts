import { BuildBindings, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL340,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
  },
});
