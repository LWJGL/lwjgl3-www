import { BuildBindings, Version } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL335,
  alias: Version.Nightly,
  byId: {
    ...prev.byId,
  },
});
