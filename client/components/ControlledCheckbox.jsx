// @flow
import * as React from 'react';
import { Checkbox } from './Checkbox';
import type { Dispatch } from 'redux';
import { Connect } from '~/store/Connect';

type Props = {|
  spec: {|
    label: string,
    action: (value: boolean) => { type: string /* ... */ },
    checked?: (state: any) => boolean,
    disabled?: (state: any) => boolean,
    hidden?: (state: any) => boolean,
  |},
|};

export const ControlledCheckbox = ({ spec }: Props) => (
  <Connect
    state={state => ({
      label: spec.label,
      checked: spec.checked != null && spec.checked(state),
      disabled: spec.disabled != null && spec.disabled(state),
      hidden: spec.hidden != null && spec.hidden(state),
    })}
    actions={(dispatch: Dispatch<*>) => ({
      handleClick: (value: boolean) => dispatch(spec.action(value)),
    })}
  >
    {({ label, disabled, hidden, checked }, { handleClick }) => (
      <Checkbox
        label={label}
        disabled={disabled}
        hidden={hidden}
        checked={checked}
        onChange={handleClick.bind(this, !checked)}
      />
    )}
  </Connect>
);
