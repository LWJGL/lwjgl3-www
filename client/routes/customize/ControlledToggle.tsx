import { useCallback } from 'react';
import { useMemoSlice } from './Store';
import { Checkbox } from '~/components/forms/Selection';

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

export function ControlledToggle({ spec }: Props) {
  const [{ label, hidden, ...slice }, dispatch] = useMemoSlice(
    (state): Slice => ({
      label: spec.label,
      checked: spec.checked !== undefined && spec.checked(state),
      disabled: spec.disabled !== undefined && spec.disabled(state),
      hidden: spec.hidden !== undefined && spec.hidden(state),
    }),
    (state) => spec.inputs(state)
  );

  const onChange = useCallback(() => dispatch(spec.action(!slice.checked)), [dispatch, spec, slice.checked]);

  return hidden ? null : (
    <Checkbox variant="switch" {...slice} onChange={onChange}>
      {label}
    </Checkbox>
  );
}
