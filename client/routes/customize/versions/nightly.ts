import { BuildBindings, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL333,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
  },
});
