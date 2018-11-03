import * as React from 'react';
import { Dispatch, ActionCreator } from 'redux';
import { Radio } from './Radio';
import { Connect } from '~/store/Connect';

interface Props {
  spec: {
    name: string;
    value: (state: any) => any;
    options: (state: any) => any;
    // hidden?: (state: any) => boolean,
    action: ActionCreator<any>;
  };
}

export interface RadioOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export type RadioOptions = Array<RadioOption>;

interface ConnectedProps {
  value: any;
  options: RadioOptions;
  // hidden: boolean,
}

export const ControlledRadio = ({ spec }: Props) => (
  <Connect
    state={(state: any): ConnectedProps => ({
      value: spec.value(state),
      options: spec.options(state),
      // hidden: spec.hidden !== undefined && spec.hidden(state),
    })}
    actions={(dispatch: Dispatch<any>) => ({
      select: (value: any) => dispatch(spec.action(value)),
    })}
  >
    {({ value: selectedValue, options /*, hidden*/ }, { select }): React.ReactNode => (
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
    )}
  </Connect>
);
