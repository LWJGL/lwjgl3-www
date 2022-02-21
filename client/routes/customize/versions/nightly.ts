import {BuildBindings, Version} from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL331,
  alias: Version.Nightly,
});
