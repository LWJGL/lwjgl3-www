// @flow
import type { BuildOptions } from '../types';

export default (prev: BuildOptions): BuildOptions => ({
  ...prev,
  version: '3.1.5',
  alias: 'stable',
});
