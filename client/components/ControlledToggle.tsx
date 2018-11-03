import * as React from 'react';
import { Toggle } from './Toggle';
import { Dispatch, ActionCreator } from 'redux';
import { Connect } from '~/store/Connect';

interface Props {
  spec: {
    label: string;
    action: ActionCreator<any>;
    checked?: (state: any) => boolean;
    disabled?: (state: any) => boolean;
    hidden?: (state: any) => boolean;
  };
}

export const ControlledToggle = ({ spec }: Props) => (
  <Connect
    state={state => ({
      label: spec.label,
      checked: spec.checked != null && spec.checked(state),
      disabled: spec.disabled != null && spec.disabled(state),
      hidden: spec.hidden != null && spec.hidden(state),
    })}
    actions={(dispatch: Dispatch<any>) => ({
      handleClick: (value: boolean) => dispatch(spec.action(value)),
    })}
  >
    {({ label, disabled, hidden, checked }, { handleClick }) => (
      <Toggle
        label={label}
        disabled={disabled}
        hidden={hidden}
        checked={checked}
        onChange={() => handleClick(!checked)}
      />
    )}
  </Connect>
);
