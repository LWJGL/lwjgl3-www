import { createPortal } from 'react-dom';

export const Head: React.FC = props => {
  return createPortal(props.children, document.head);
};
