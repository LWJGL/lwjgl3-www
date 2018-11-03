import * as React from 'react';
import shallowEqual from 'fbjs/lib/shallowEqual';

export const StateMemo = React.memo(
  (props: any) => React.Children.only(props.children),
  (prevProps: any, nextProps: any) => shallowEqual(prevProps.state, nextProps.state)
);
