import * as React from 'react';
import { memo, useRef } from 'react';
import uniqueId from 'lodash-es/uniqueId';

interface Props {
  label: string;
  value?: any;
  checked?: boolean;
  onChange: (value: any) => void;
  disabled?: boolean;
  hidden?: boolean;
  icon?: React.ReactNode;
}

export const Checkbox = memo(
  ({ label, value, checked = false, onChange, disabled = false, hidden = false, icon }: Props) => {
    const htmlForId = useRef(uniqueId('checkbox'));

    return hidden === true ? null : (
      <div className="custom-control custom-checkbox">
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
  }
);
