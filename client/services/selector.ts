import { createSelectorCreator, lruMemoize } from 'reselect';
import isEqual from 'react-fast-compare';
import { shallowEqual } from './shallowEqual';

export const createSelectorDeepEqual = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: { maxSize: 2, equalityCheck: isEqual },
});

export const createSelectorShallowEqual = createSelectorCreator({
  memoize: lruMemoize,
  memoizeOptions: { maxSize: 2, equalityCheck: shallowEqual },
});
