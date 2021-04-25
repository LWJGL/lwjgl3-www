import { Link } from '~/components/router/client';
import { Button } from '../forms/Button';
import type { ButtonProps } from '../forms/Button';
import type { LinkProps } from '~/components/router/client';

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
