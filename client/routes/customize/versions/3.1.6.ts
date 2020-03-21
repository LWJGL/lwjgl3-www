import { Version } from '../types';
import type { BuildBindings } from '../types';

export default (prev: BuildBindings): BuildBindings => ({
  ...prev,
  version: Version.LWJGL316,
});
