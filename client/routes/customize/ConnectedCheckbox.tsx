import { useCallback } from 'react';
import { useStore, useDispatch } from './store';
import { Checkbox } from '~/components/forms/Selection';

import type { CheckboxProps } from '~/components/forms/Selection';
import type { BuildStore } from './types';

interface ConnectedCheckboxProps extends Omit<Omit<CheckboxProps, 'onChange'>, 'checked'> {
  checked: (state: BuildStore) => boolean;
  hidden?: (state: BuildStore) => boolean;
  action: (checked: boolean) => any;
}

export const ConnectedCheckbox: React.FC<ConnectedCheckboxProps> = ({
  checked,
  hidden = () => false,
  action,
  ...rest
}) => {
  const isChecked = useStore(checked);
  const isHidden = useStore(hidden);
  const dispatch = useDispatch();
  const onChange = useCallback(() => {
    dispatch(action(!isChecked));
  }, [dispatch, action, isChecked]);

  return isHidden ? null : <Checkbox checked={isChecked} onChange={onChange} {...rest} />;
};
