// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  tag: string,
  children?: React.Node,
};

export class Head extends React.PureComponent<Props> {
  render() {
    const { tag: Tag, ...rest } = this.props;

    const Comp = <Tag {...rest} />;
    return ReactDOM.createPortal(Comp, document.head || document.getElementsByTagName('head')[0]);
  }
}
