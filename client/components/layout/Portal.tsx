import { createPortal } from 'react-dom';

export const Portal: FCC = ({ children }) => {
  return createPortal(children, document.body);
};
