import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

export const LinkButton: React.FC<LinkProps> = ({ className, children, ...rest }) => {
  let cl = 'btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2';
  if (className !== undefined) {
    cl += ` ${className}`;
  }

  return (
    <Link className={cl} {...rest}>
      {children}
    </Link>
  );
};
