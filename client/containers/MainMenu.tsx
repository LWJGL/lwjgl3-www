import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

export const MainMenu: React.FC<Props> = ({ onClick, className }) => (
  <div role="navigation" aria-label="Main Menu" className={className}>
    <ul className="list-unstyled m-0">
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
        <a href="https://opencollective.com/lwjgl" target="_blank" rel="noopener external">
          DONATE
        </a>
      </li>
      <li>
        <a href="http://forum.lwjgl.org/" target="_blank" rel="noopener external">
          FORUM
        </a>
      </li>
      <li>
        <a href="https://blog.lwjgl.org/" target="_blank" rel="noopener external">
          BLOG
        </a>
      </li>
    </ul>
  </div>
);
