import React from 'react';
import { useMemo } from 'react';
import { useMemoSlice } from './Store';
import { Radio } from '~/components/Radio';

interface Props {
  spec: {
    name: string;
    value: (state: any) => any;
    options: (state: any) => any;
    // hidden?: (state: any) => boolean,
    action: any;
    inputs: (state: any) => React.InputIdentityList;
  };
}

export interface RadioOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export type RadioOptions = Array<RadioOption>;

interface State {
  value: any;
  options: RadioOptions;
  // hidden: boolean,
}

export function ControlledRadio({ spec }: Props) {
  const [slice, dispatch] = useMemoSlice(
    (state): State => ({
      value: spec.value(state),
      options: spec.options(state),
    }),
    state => spec.inputs(state)
  );

  return useMemo(
    () => {
      const { value: selectedValue, options } = slice;
      const select = (value: any) => dispatch(spec.action(value));

      return (
        <div className="custom-controls-stacked">
          {options.map(({ value, label, disabled }: RadioOption, i: number) => (
            <Radio
              key={`${spec.name}-${typeof value === 'string' ? value : i}`}
              value={value}
              checked={value === selectedValue}
              onChange={select}
              label={label}
              disabled={disabled === true}
            />
          ))}
        </div>
      );
    },
    [slice]
  );
}
