// @flow
import * as React from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  onClick?: (e: Event) => any,
  rest?: {},
};

export const MainMenu = ({ onClick, ...rest }: Props) => (
  <ul {...rest} role="navigation" aria-label="Main Menu">
    <li>
      <NavLink ariaCurrent="page" activeClassName="active" exact={true} onClick={onClick} to="/">
        HOME
      </NavLink>
    </li>
    <li>
      <NavLink ariaCurrent="page" activeClassName="active" exact={true} onClick={onClick} to="/guide">
        GET STARTED
      </NavLink>
    </li>
    <li>
      <NavLink ariaCurrent="page" activeClassName="active" exact={true} onClick={onClick} to="/download">
        DOWNLOAD
      </NavLink>
    </li>
    <li>
      <NavLink ariaCurrent="page" activeClassName="active" exact={true} onClick={onClick} to="/customize">
        CUSTOMIZE
      </NavLink>
    </li>
    <li>
      <NavLink ariaCurrent="page" activeClassName="active" exact={true} onClick={onClick} to="/source">
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
);
