import { useMemo, useCallback } from 'react';
import { useMemoSlice } from './Store';
import { Radio } from '~/components/forms/Selection';

interface Props {
  spec: {
    name: string;
    value: (state: any) => any;
    options: (state: any) => any;
    // hidden?: (state: any) => boolean,
    action: any;
    inputs: (state: any) => React.DependencyList;
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
    (state) => spec.inputs(state)
  );

  const select = useCallback((e, value: any) => dispatch(spec.action(value)), [dispatch, spec]);

  return useMemo(() => {
    const { value: selectedValue, options } = slice;

    return (
      <>
        {options.map(({ value, label, disabled }: RadioOption, i: number) => (
          <Radio
            key={`${spec.name}-${typeof value === 'string' ? value : i}`}
            value={value}
            checked={value === selectedValue}
            onChange={select}
            disabled={disabled === true}
          >
            {label}
          </Radio>
        ))}
      </>
    );
  }, [slice, select, spec.name]);
}
