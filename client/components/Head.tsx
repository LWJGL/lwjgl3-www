import React from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
}

export function Head(props: Props) {
  return createPortal(props.children, document.head);
}
