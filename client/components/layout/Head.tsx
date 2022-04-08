import { createPortal } from 'react-dom';

export const Head: FCC = ({ children }) => {
  return createPortal(children, document.head);
};
