// @flow
import * as React from 'react';
import { uniqueId } from 'lodash-es';
import styled from 'react-emotion';
import { COLOR_WHITE, COLOR_CUSTOM_CONTROL_INDICATOR_BG } from '~/theme';

const Label = styled('label')`
  &:before {
    width: 1.5rem;
    left: -0.25rem;
    background: ${COLOR_CUSTOM_CONTROL_INDICATOR_BG.darken(10).css()};
  }

  &:after {
    width: 0.8rem;
    height: 0.8rem;
    top: 0;
    left: 0;
    transform: translate(-0.13rem, 0.345rem);
    background-color: ${COLOR_WHITE.css()};
  }

  &:after,
  &:before {
    border-radius: 1rem;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;

const Input = styled('input')`
  &:checked ~ ${Label}:after {
    transform: translate(0.35rem, 0.345rem);
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
