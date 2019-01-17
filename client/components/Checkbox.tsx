import React, { memo, useRef } from 'react';
import uniqueId from 'lodash-es/uniqueId';

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

export const Checkbox = memo(
  ({ label, value, onChange, checked = false, disabled = false, hidden = false, toggle = false, icon }: Props) => {
    const htmlForId = useRef(uniqueId('checkbox'));

    return hidden === true ? null : (
      <div className={`custom-control custom-${toggle === true ? 'switch' : 'checkbox'}`}>
        <input
          type="checkbox"
          id={htmlForId.current}
          className="custom-control-input"
          disabled={disabled}
          checked={checked}
          onChange={() => onChange(value)}
        />
        <label className="custom-control-label" htmlFor={htmlForId.current}>
          {icon}
          {icon != null ? ' ' : null}
          {label}
        </label>
      </div>
    );
  },
  (prevProps: Props, nextProps: Props) =>
    prevProps.checked === nextProps.checked &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.hidden === nextProps.hidden &&
    prevProps.value === nextProps.value &&
    prevProps.label === nextProps.label &&
    prevProps.icon === nextProps.icon
);
