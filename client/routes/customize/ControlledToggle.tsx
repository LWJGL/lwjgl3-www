import * as React from 'react';
import { useMemo } from 'react';
import { useMemoSlice } from './Store';
import { Toggle } from '~/components/Toggle';

interface Props {
  spec: {
    label: string;
    action: any;
    checked?: (state: any) => boolean;
    disabled?: (state: any) => boolean;
    hidden?: (state: any) => boolean;
    inputs: (state: any) => React.InputIdentityList;
  };
}

interface Slice {
  label: string;
  checked: boolean;
  disabled: boolean;
  hidden: boolean;
}

export function ControlledToggle({ spec }: Props) {
  const [slice, dispatch] = useMemoSlice(
    (state): Slice => ({
      label: spec.label,
      checked: spec.checked !== undefined && spec.checked(state),
      disabled: spec.disabled !== undefined && spec.disabled(state),
      hidden: spec.hidden !== undefined && spec.hidden(state),
    }),
    state => spec.inputs(state)
  );

  return useMemo(() => <Toggle {...slice} onChange={() => dispatch(spec.action(!slice.checked))} />, [slice]);
}
