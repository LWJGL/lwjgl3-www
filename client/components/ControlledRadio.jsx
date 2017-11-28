// @flow
import * as React from 'react';
import { type Dispatch } from 'redux';
import { RadioGroup } from './RadioGroup';
import { Radio } from './Radio';
import { Connect } from '~/store/Connect';

type Props = {|
  spec: {|
    name: string,
    value: (state: any) => mixed,
    options: (state: any) => any,
    // hidden?: (state: any) => boolean,
    action: (value: any) => any,
  |},
|};

type Option = {|
  label: string,
  value: any,
  disabled: boolean,
|};

type ConnectedProps = {|
  value: any,
  options: Array<Option>,
  // hidden: boolean,
|};

export const ControlledRadio = ({ spec }: Props) => (
  <Connect
    state={(state: Object): ConnectedProps => ({
      value: spec.value(state),
      options: spec.options(state),
      // hidden: spec.hidden !== undefined && spec.hidden(state),
    })}
    actions={(dispatch: Dispatch<*>) => ({
      select: (value: any) => dispatch(spec.action(value)),
    })}
  >
    {({ value, options /*, hidden*/ }, { select }): React.Node => (
      <RadioGroup value={value} onChange={select}>
        {options.map((radio: Option, i: number) => (
          <Radio
            key={`${spec.name}-${typeof radio.value === 'string' ? radio.value : i}`}
            value={radio.value}
            label={radio.label}
            disabled={radio.disabled}
          />
        ))}
      </RadioGroup>
    )}
  </Connect>
);
