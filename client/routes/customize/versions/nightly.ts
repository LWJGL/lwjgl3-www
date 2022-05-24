import {BuildBindings, Version} from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL332,
  alias: Version.Nightly,
});
