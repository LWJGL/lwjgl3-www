import * as React from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  onClick?: (e: Event) => any,
  rest?: {},
};

const MainMenu = ({ onClick, ...rest }: Props) =>
  <ul {...rest} role="navigation" aria-label="Main Menu">
    <li>
      <NavLink activeClassName="active" onClick={onClick} to="/" exact={true}>
        HOME
      </NavLink>
    </li>
    <li>
      <NavLink activeClassName="active" onClick={onClick} to="/guide">
        GET STARTED
      </NavLink>
    </li>
    <li>
      <NavLink activeClassName="active" onClick={onClick} to="/download">
        DOWNLOAD
      </NavLink>
    </li>
    <li>
      <NavLink activeClassName="active" onClick={onClick} to="/source">
        SOURCE
      </NavLink>
    </li>
    <li>
      <a href="http://forum.lwjgl.org/" target="_blank">
        FORUM
      </a>
    </li>
    <li>
      <a href="http://blog.lwjgl.org/" target="_blank">
        BLOG
      </a>
    </li>
  </ul>;

export default MainMenu;
