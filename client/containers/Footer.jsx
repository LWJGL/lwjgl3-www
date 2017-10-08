// @flow
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import LazyImg from '~/components/LazyImg';

const Footer = () => (
  <footer>
    <section className="container">
      <nav className="row">
        <div className="col-sm">
          <h3>About</h3>
          <ul className="list-unstyled">
            <li>
              <NavLink ariaCurrent="page" exact={true} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink ariaCurrent="page" exact={true} to="/guide">
                Get Started
              </NavLink>
            </li>
            <li>
              <NavLink ariaCurrent="page" exact={true} to="/download">
                Download
              </NavLink>
            </li>
            <li>
              <NavLink ariaCurrent="page" exact={true} to="/customize">
                Customize
              </NavLink>
            </li>
            <li>
              <NavLink ariaCurrent="page" exact={true} to="/source">
                Source
              </NavLink>
            </li>
            <li>
              <NavLink ariaCurrent="page" exact={true} to="/license">
                License
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="col-sm">
          <h3>News</h3>
          <ul className="list-unstyled">
            <li>
              <a href="http://blog.lwjgl.org/">Blog</a>
            </li>
            <li>
              <a href="http://forum.lwjgl.org/">Forum</a>
            </li>
            <li>
              <a href="https://twitter.com/lwjgl" rel="external nofollow">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://github.com/LWJGL/lwjgl3/commits/master">Changelog</a>
            </li>
            <li>
              <a href="https://github.com/LWJGL/lwjgl3/blob/master/doc/notes/latest.md">Release notes</a>
            </li>
          </ul>
        </div>
        <div className="col-sm">
          <h3>Developers</h3>
          <ul className="list-unstyled">
            <li>
              <a href="https://github.com/LWJGL/lwjgl3">GitHub</a>
            </li>
            <li>
              <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki">Wiki</a>
            </li>
            <li>
              <a href="https://github.com/LWJGL/lwjgl3/issues">Issues</a>
            </li>
            <li>
              <a href="http://javadoc.lwjgl.org/">JavaDoc</a>
            </li>
            <li>
              <a href="https://slack.lwjgl.org/">Slack</a>
            </li>
          </ul>
        </div>
        <div className="col-sm">
          <h3>Sponsor</h3>
          <a href="https://www.webhotelier.net/" title="WebHotelier" rel="external">
            <LazyImg className="mb-2" alt="WebHotelier" src="/svg/webhotelier.svg" />
          </a>
        </div>
      </nav>
    </section>
    <section className="container copyright">
      <p>Copyright © 2012-{new Date().getFullYear()} Lightweight Java Game Library 3</p>
      <p>
        Licensed under{' '}
        <NavLink ariaCurrent="page" exact={true} to="/license">
          BSD
        </NavLink>
      </p>
    </section>
  </footer>
);

export default Footer;
