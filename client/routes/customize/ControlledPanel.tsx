import { useSelector } from './Store';
import { BuildStore } from './types';

interface Props {
  predicate: (state: BuildStore) => boolean;
}

export const ControlledPanel: React.FC<Props> = ({ children, predicate }) => {
  const visible = useSelector(predicate);
  return visible ? (children as JSX.Element) : null;
};
