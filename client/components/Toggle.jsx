// @flow
// @jsx jsx
import * as React from 'react';
import { jsx } from '@emotion/core';
import css from '@emotion/css';
import uniqueId from 'lodash-es/uniqueId';
import { COLOR_WHITE, COLOR_CUSTOM_CONTROL_INDICATOR_BG, COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG } from '~/theme';

import { lighten, setSaturation } from '~/theme/color';

const COLOR_TOGGLE_INDICATOR_CHECKED_BG = lighten(COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG, 30);
const COLOR_TOGGLE_INDICATOR_BG = setSaturation(COLOR_CUSTOM_CONTROL_INDICATOR_BG, 0);

type Props = {
  label: string,
  value?: any,
  checked?: boolean,
  disabled?: boolean,
  hidden?: boolean,
  onChange?: (value: any) => mixed,
};

export class Toggle extends React.PureComponent<Props> {
  static defaultProps = {
    checked: false,
    disabled: false,
    hidden: false,
  };

  htmlForId = uniqueId('toggle');

  change = this.change.bind(this);
  change() {
    if (this.props.onChange != null) {
      this.props.onChange(this.props.value);
    }
  }

  render() {
    const props = this.props;

    return props.hidden === true ? null : (
      <div className="custom-control">
        <input
          className="custom-control-input"
          type="checkbox"
          id={this.htmlForId}
          disabled={props.disabled}
          checked={props.checked}
          onChange={this.change}
          css={css`
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
          `}
        />
        <label
          css={css`
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
          `}
          className="custom-control-label"
          htmlFor={this.htmlForId}
        >
          {props.label}
        </label>
      </div>
    );
  }
}
