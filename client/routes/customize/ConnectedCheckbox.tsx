import { useCallback } from 'react';
import { useSelector, useDispatch } from './Store';
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
  const isChecked = useSelector(checked);
  const isHidden = useSelector(hidden);
  const dispatch = useDispatch();
  const onChange = useCallback(() => {
    dispatch(action(!isChecked));
  }, [dispatch, action, isChecked]);

  return isHidden ? null : <Checkbox checked={isChecked} onChange={onChange} {...rest} />;
};
