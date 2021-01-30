import { createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'react-fast-compare';
import { shallowEqual } from './shallowEqual';

export const createSelectorDeepEqual = createSelectorCreator(defaultMemoize, isEqual);
export const createSelectorShallowEqual = createSelectorCreator(defaultMemoize, shallowEqual);
