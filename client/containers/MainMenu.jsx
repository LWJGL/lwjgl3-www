// @flow
import * as React from 'react';
//$FlowFixMe
import { memo } from 'react';
import { Link } from '@reach/router';

type Props = {
  onClick?: (e: Event) => any,
  className?: string,
};

const isActive = ({ isCurrent }) => {
  return isCurrent ? { className: 'active' } : null;
};

const NavLink = props => <Link getProps={isActive} {...props} />;

export const MainMenu = memo(({ onClick, className }: Props) => (
  <ul role="navigation" aria-label="Main Menu" className={className}>
    <li>
      <NavLink onClick={onClick} to="/">
        HOME
      </NavLink>
    </li>
    <li>
      <NavLink onClick={onClick} to="/guide">
        GET STARTED
      </NavLink>
    </li>
    <li>
      <NavLink onClick={onClick} to="/download">
        DOWNLOAD
      </NavLink>
    </li>
    <li>
      <NavLink onClick={onClick} to="/customize">
        CUSTOMIZE
      </NavLink>
    </li>
    <li>
      <NavLink onClick={onClick} to="/source">
        SOURCE
      </NavLink>
    </li>
    <li>
      <a href="https://opencollective.com/lwjgl" target="_blank" rel="noopener">
        DONATE
      </a>
    </li>
    <li>
      <a href="http://forum.lwjgl.org/" target="_blank" rel="noopener">
        FORUM
      </a>
    </li>
    <li>
      <a href="https://blog.lwjgl.org/" target="_blank" rel="noopener">
        BLOG
      </a>
    </li>
  </ul>
));
