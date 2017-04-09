import React from 'react';
import { func } from 'prop-types';
import NavLink from 'react-router-dom/NavLink';

const MainMenu = ({ onClick, ...rest }) => (
  <ul {...rest} role="navigation" aria-label="Main Menu">
    <li><NavLink activeClassName="active" onClick={onClick} to="/" exact={true}>HOME</NavLink></li>
    <li><NavLink activeClassName="active" onClick={onClick} to="/guide">GET STARTED</NavLink></li>
    <li><NavLink activeClassName="active" onClick={onClick} to="/download">DOWNLOAD</NavLink></li>
    <li><NavLink activeClassName="active" onClick={onClick} to="/source">SOURCE</NavLink></li>
    <li><a href="http://forum.lwjgl.org/" target="_blank">FORUM</a></li>
    <li><a href="http://blog.lwjgl.org/" target="_blank">BLOG</a></li>
  </ul>
);

MainMenu.propTypes = {
  onClick: func,
};

export default MainMenu;
