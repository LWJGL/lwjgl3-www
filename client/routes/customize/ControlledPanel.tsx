import { useStore } from './store';
import { BuildStore } from './types';

interface Props {
  predicate: (state: BuildStore) => boolean;
}

export const ControlledPanel: FCC<Props> = ({ children, predicate }) => {
  const visible = useStore(predicate);
  return visible ? children : null;
};
