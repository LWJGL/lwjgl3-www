import * as React from 'react';
import type { ReactSelectProps } from 'react-select';

declare module 'react-virtualized-select' {
  declare type VirtualizedSelectProps = ReactSelectProps & {
    async?: boolean,
    maxHeight?: number,
    optionHeight?: number,
    optionRenderer: () => void,
    selectComponent: () => React.ComponentType<any>,
  };

  declare export default React.ComponentType<VirtualizedSelectProps>
}
