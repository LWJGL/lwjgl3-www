import { useMemo } from 'react';
import { useMemoSlice } from './Store';
import { Checkbox } from '~/components/Checkbox';

interface Props {
  spec: {
    label: string;
    action: any;
    checked?: (state: any) => boolean;
    disabled?: (state: any) => boolean;
    hidden?: (state: any) => boolean;
    inputs: (state: any) => React.DependencyList;
  };
}

interface Slice {
  label: string;
  checked: boolean;
  disabled: boolean;
  hidden: boolean;
}

export function ControlledCheckbox({ spec }: Props) {
  const [slice, dispatch] = useMemoSlice(
    (state): Slice => ({
      label: spec.label,
      checked: spec.checked !== undefined && spec.checked(state),
      disabled: spec.disabled !== undefined && spec.disabled(state),
      hidden: spec.hidden !== undefined && spec.hidden(state),
    }),
    state => spec.inputs(state)
  );

  return useMemo(() => <Checkbox {...slice} onChange={() => dispatch(spec.action(!slice.checked))} />, [
    spec,
    slice,
    dispatch,
  ]);
}
