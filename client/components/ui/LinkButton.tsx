import { Link } from 'react-router-dom';
import { Button } from '../forms/Button';
import type { ButtonProps } from '../forms/Button';
import type { LinkProps } from 'react-router-dom';

export type LinkButtonProps = ButtonProps & LinkProps;
export type AnchorButtonProps = ButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const LinkButton: React.FC<LinkButtonProps> = ({ children, ...rest }) => (
  <Button draggable="false" {...rest} as={Link}>
    {children}
  </Button>
);

export const AnchorButton: React.FC<AnchorButtonProps> = ({ children, ...rest }) => (
  <Button draggable="false" {...rest} as={'a'}>
    {children}
  </Button>
);
