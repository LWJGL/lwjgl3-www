// @flow
import * as React from 'react';
//$FlowFixMe
import { memo, useRef } from 'react';
import uniqueId from 'lodash-es/uniqueId';

type Props = {
  value: any,
  label: string,
  disabled?: boolean,
  checked?: boolean,
  onChange: (value: any) => void,
};

export const Radio = React.memo(({ label, value, checked = false, onChange, disabled = false }: Props) => {
  const htmlForId = useRef(uniqueId('radio'));

  return (
    <div className="custom-control custom-radio">
      <input
        type="radio"
        id={htmlForId.current}
        className="custom-control-input"
        disabled={disabled}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <label className="custom-control-label" htmlFor={htmlForId.current}>
        {label}
      </label>
    </div>
  );
});
