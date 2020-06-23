import { useRef } from 'react';
import uniqueId from 'lodash-es/uniqueId';

interface Props {
  value: any;
  label: string;
  disabled?: boolean;
  checked?: boolean;
  onChange: (value: any) => void;
}

export const Radio = ({ label, value, checked = false, onChange, disabled = false }: Props) => {
  const htmlForId = useRef(uniqueId('radio'));

  return (
    <div className="form-check">
      <input
        type="radio"
        id={htmlForId.current}
        className="form-check-input"
        disabled={disabled}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <label className="form-check-label" htmlFor={htmlForId.current}>
        {label}
      </label>
    </div>
  );
};
