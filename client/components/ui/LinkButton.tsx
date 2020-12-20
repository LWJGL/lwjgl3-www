import { Link } from 'react-router-dom';
import { Button } from '../forms/Button';
import type { ButtonProps } from '../forms/Button';
import type { LinkProps } from 'react-router-dom';

export type LinkButtonProps = ButtonProps & LinkProps;
export type AnchorButtonProps = ButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const LinkButton: React.FC<LinkButtonProps> = ({ children, ...rest }) => (
  //@ts-expect-error
  <Button draggable="false" as={Link} {...rest}>
    {children}
  </Button>
);

export const AnchorButton: React.FC<AnchorButtonProps> = ({ children, ...rest }) => (
  //@ts-expect-error
  <Button draggable="false" as="a" {...rest}>
    {children}
  </Button>
);
