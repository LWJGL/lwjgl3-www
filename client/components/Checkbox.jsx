// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useRef } from 'react';
import uniqueId from 'lodash-es/uniqueId';

type Props = {
  label: string,
  value?: mixed,
  checked?: boolean,
  onChange: (value: mixed) => mixed,
  disabled?: boolean,
  hidden?: boolean,
  icon?: React.Node,
};

export const Checkbox = memo(
  ({ label, value, checked = false, onChange, disabled = false, hidden = false, icon }: Props) => {
    const htmlForId = useRef(uniqueId('checkbox'));
    const handleChange = () => onChange(value);

    return hidden === true ? null : (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          id={htmlForId.current}
          className="custom-control-input"
          disabled={disabled}
          checked={checked}
          onChange={handleChange}
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
