// @flow
import * as React from 'react';
import { uniqueId } from 'lodash-es';
import styled from 'react-emotion';
import { COLOR_WHITE, COLOR_CUSTOM_CONTROL_INDICATOR_BG, COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG } from '~/theme';

const COLOR_TOGGLE_INDICATOR_CHECKED_BG = COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG.lighten(30);
const COLOR_TOGGLE_INDICATOR_BG = COLOR_CUSTOM_CONTROL_INDICATOR_BG.s(0);

const Label = styled('label')`
  &::before {
    width: 1.5rem;
    margin-top: 0.2rem;
    height: 0.7rem;
    left: -0.25rem;
    background-color: ${COLOR_TOGGLE_INDICATOR_BG.css()};
    box-shadow: inset 0 0.25rem 0.25rem rgba(0, 0, 0, 0.1) !important;
  }

  &::after {
    width: 1rem;
    height: 1rem;
    top: 0.3rem;
    left: -0.3rem;
    background-color: ${COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG.s(0).css()};
  }

  &::after,
  &::before {
    border-radius: 2rem;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;

const Input = styled('input')`
  &:checked ~ ${Label}::after {
    left: 0.3rem;
    background-color: ${COLOR_CUSTOM_CONTROL_INDICATOR_CHECKED_BG.css()};
  }
  &:checked ~ ${Label}::before {
    background-color: ${COLOR_TOGGLE_INDICATOR_CHECKED_BG.css()};
  }
  &:active ~ ${Label}::after {
    width: 1.15rem;
  }
  &:focus ~ ${Label}::after {
    box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  &:checked:active ~ ${Label}::after {
    left: 0.1rem;
  }
  &:active ~ ${Label}::before {
    background-color: ${COLOR_TOGGLE_INDICATOR_BG.css()};
  }
  &:checked:active ~ ${Label}::before {
    background-color: ${COLOR_TOGGLE_INDICATOR_CHECKED_BG.css()};
  }
  &:disabled ~ ${Label}::after {
    display: none;
  }
  &:checked:disabled ~ ${Label}::before {
    background-color: ${COLOR_TOGGLE_INDICATOR_CHECKED_BG.css()};
  }
`;

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

  htmlForId: string;

  constructor(props: Props) {
    super(props);
    this.htmlForId = uniqueId('toggle');
    (this: any).change = this.change.bind(this);
  }

  change() {
    if (this.props.onChange != null) {
      this.props.onChange(this.props.value);
    }
  }

  render() {
    const props = this.props;

    return props.hidden === true ? null : (
      <div className="custom-control">
        <Input
          className="custom-control-input"
          type="checkbox"
          id={this.htmlForId}
          disabled={props.disabled}
          checked={props.checked}
          onChange={this.change}
        />
        <Label className="custom-control-label" htmlFor={this.htmlForId}>
          {props.label}
        </Label>
      </div>
    );
  }
}
