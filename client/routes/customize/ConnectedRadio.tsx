import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from './Store';
import { createSelectorDeepEqual } from '~/services/selector';
import { Radio, type RadioProps } from '~/components/forms/Selection';

import type { BuildStore } from './types';

interface RadioOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export type RadioOptions = Array<RadioOption>;

interface ConnectedRadioProps extends Omit<Omit<RadioProps, 'onChange'>, 'checked'> {
  name: string;
  value: (state: BuildStore) => any;
  options: (state: BuildStore) => RadioOptions;
  action: (value: any) => any;
}

export const ConnectedRadio: React.FC<ConnectedRadioProps> = ({ name, value, options, action }) => {
  const selectedValue = useSelector(value);
  const radioSelector = useMemo(() => createSelectorDeepEqual(options, (d) => d), [options]);
  const radios = useSelector(radioSelector);
  const dispatch = useDispatch();
  const onChange: RadioProps['onChange'] = useCallback(
    (e, val: any) => {
      dispatch(action(val));
    },
    [dispatch, action]
  );

  return (
    <>
      {radios.map(({ value, label, disabled }: RadioOption, i: number) => (
        <Radio
          key={`${name}-${typeof value === 'string' ? value : i}`}
          value={value}
          checked={value === selectedValue}
          onChange={onChange}
          disabled={disabled === true}
        >
          {label}
        </Radio>
      ))}
    </>
  );
};
