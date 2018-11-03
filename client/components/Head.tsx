import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
  children: React.ReactNode;
}

export function Head(props: Props) {
  return ReactDOM.createPortal(props.children, document.head);
}
