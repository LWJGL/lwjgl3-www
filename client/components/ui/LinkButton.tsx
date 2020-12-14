import { Link } from 'react-router-dom';
import { Button } from '../forms/Button';
import type { LinkProps } from 'react-router-dom';

type LinkButtonProps = React.ComponentProps<typeof Button> & LinkProps;
type AnchorButtonProps = React.ComponentProps<typeof Button> & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const LinkButton: React.FC<LinkButtonProps> = ({ children, ...rest }) => (
  <Button as={Link} {...rest}>
    {children}
  </Button>
);

export const AnchorButton: React.FC<AnchorButtonProps> = ({ children, ...rest }) => (
  <Button as="a" {...rest}>
    {children}
  </Button>
);
