// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  tag: string,
  children?: React.Node,
};

export const Head = (props: Props) => {
  const { tag: Tag, ...rest } = props;

  const Comp = <Tag {...rest} />;
  //$FlowFixMe
  return ReactDOM.createPortal(Comp, document.head);
};
