import * as React from 'react';
// import { useRef } from 'react';
import { Toggle } from '~/components/Toggle';
import { StateMemo } from '~/components/StateMemo';
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
  const toggleAction = () => dispatch(spec.action(!checked));

  return (
    <StateMemo state={state}>
      <Toggle label={label} disabled={disabled} hidden={hidden} checked={checked} onChange={toggleAction} />
    </StateMemo>
  );
}
