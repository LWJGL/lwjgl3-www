import { unstable_useOpaqueIdentifier as useOpaqueIdentifier } from 'react';
import { cc } from '~/theme/cc';

interface Props {
  label: string;
  value?: any;
  onChange: (value: any) => void;
  checked?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  toggle?: boolean;
  icon?: React.ReactNode;
}

export const Checkbox: React.FC<Props> = ({
  label,
  value,
  onChange,
  checked = false,
  disabled = false,
  hidden = false,
  toggle = false,
  icon,
}) => {
  const htmlForId = useOpaqueIdentifier();

  return hidden === true ? null : (
    <div className={cc('form-check', { 'form-switch': toggle })}>
      <input
        type="checkbox"
        id={htmlForId}
        className="form-check-input"
        disabled={disabled}
        checked={checked}
        onChange={() => {
          onChange(value);
        }}
      />
      <label className="form-check-label" htmlFor={htmlForId}>
        {icon}
        {icon != null ? ' ' : null}
        {label}
      </label>
    </div>
  );
};
