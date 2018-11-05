import * as React from 'react';
import { Toggle } from '~/components/Toggle';
import { useStore } from './Store';

interface Props {
  spec: {
    label: string;
    action: any;
    checked?: (state: any) => boolean;
    disabled?: (state: any) => boolean;
    hidden?: (state: any) => boolean;
  };
}

interface State {
  label: string;
  checked: boolean;
  disabled: boolean;
  hidden: boolean;
}

export function ControlledToggle({ spec }: Props) {
  const [state, dispatch] = useStore(
    (state): State => ({
      label: spec.label,
      checked: spec.checked != null && spec.checked(state),
      disabled: spec.disabled != null && spec.disabled(state),
      hidden: spec.hidden != null && spec.hidden(state),
    })
  );

  const { label, disabled, hidden, checked } = state;

  return (
    <Toggle
      label={label}
      disabled={disabled}
      hidden={hidden}
      checked={checked}
      onChange={() => dispatch(spec.action(!checked))}
    />
  );
}
