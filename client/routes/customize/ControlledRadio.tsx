import * as React from 'react';
import { Radio } from '~/components/Radio';
import { useStore } from './Store';

interface Props {
  spec: {
    name: string;
    value: (state: any) => any;
    options: (state: any) => any;
    // hidden?: (state: any) => boolean,
    action: any;
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
  const [state, dispatch] = useStore(
    (state): State => ({
      value: spec.value(state),
      options: spec.options(state),
    })
  );

  const { value: selectedValue, options } = state;
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
}
