import { css } from 'emotion';
import uniqueId from 'lodash-es/uniqueId';
import React, { useRef } from 'react';
import { COLOR_CUSTOM_CONTROL_INDICATOR_BG, COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG } from '~/theme';
import { lighten, setSaturation } from '~/theme/color';

const COLOR_TOGGLE_INDICATOR_CHECKED_BG = lighten(COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG, 30);
const COLOR_TOGGLE_INDICATOR_BG = setSaturation(COLOR_CUSTOM_CONTROL_INDICATOR_BG, 0);

const InputStyle = css`
  &:active ~ .custom-control-label::after,
  &:focus ~ .custom-control-label::after {
    box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  & ~ .custom-control-label::after {
    transform: translate(-0.3rem, 0.05rem);
  }
  &:checked ~ .custom-control-label::after {
    transform: translate(0.3rem, 0.05rem);
    background-color: ${COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG.css()};
  }
  &:checked ~ .custom-control-label::before {
    background-color: ${COLOR_TOGGLE_INDICATOR_CHECKED_BG.css()};
  }
  &:active ~ .custom-control-label::before {
    background-color: ${COLOR_TOGGLE_INDICATOR_BG.css()};
  }
  &:checked:active ~ .custom-control-label::before {
    background-color: ${COLOR_TOGGLE_INDICATOR_CHECKED_BG.css()};
  }
  &:disabled ~ .custom-control-label::after {
    display: none;
  }
  &:checked:disabled ~ .custom-control-label::before {
    background-color: ${COLOR_TOGGLE_INDICATOR_CHECKED_BG.css()};
  }
`;

const LabelStyle = css`
  &::before {
    width: 1.5rem;
    margin-top: 0.2rem;
    height: 0.7rem;
    left: -0.25rem;
    background-color: ${COLOR_TOGGLE_INDICATOR_BG.css()};
    box-shadow: inset 0 0.25rem 0.25rem rgba(0, 0, 0, 0.1) !important;
    will-change: background-color;
  }

  &::after {
    width: 1rem;
    height: 1rem;
    transform-origin: center;
    background-color: ${setSaturation(COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG, 0).css()};
    will-change: transform, background-color;
  }

  &::after,
  &::before {
    border-radius: 2rem;
    transition: transform 0.333s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.6s ease-out;
  }
`;

interface Props {
  label: string;
  value?: any;
  onChange: (value: any) => void;
  checked?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export const Toggle = ({ label, value, onChange, checked = false, disabled = false, hidden = false }: Props) => {
  const htmlForId = useRef(uniqueId('toggle'));

  return hidden === true ? null : (
    <div className="custom-control">
      <input
        className={`custom-control-input ${InputStyle}`}
        type="checkbox"
        id={htmlForId.current}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
      />
      <label className={`custom-control-label ${LabelStyle}`} htmlFor={htmlForId.current}>
        {label}
      </label>
    </div>
  );
};
