import { Link, useLocation } from 'react-router-dom';

const FOOTER = (
  <footer>
    <section className="container">
      <nav className="row">
        <div className="col-sm">
          <h3>About</h3>
          <ul className="list-unstyled">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/guide">Get Started</Link>
            </li>
            <li>
              <Link to="/download">Download</Link>
            </li>
            <li>
              <Link to="/customize">Customize</Link>
            </li>
            <li>
              <Link to="/source">Source</Link>
            </li>
            <li>
              <Link to="/sponsors">Sponsors</Link>
            </li>
            <li>
              <Link to="/license">License</Link>
            </li>
          </ul>
        </div>
        <div className="col-sm">
          <h3>News</h3>
          <ul className="list-unstyled">
            <li>
              <a href="https://blog.lwjgl.org/" rel="noopener external">
                Blog
              </a>
            </li>
            <li>
              <a href="http://forum.lwjgl.org/" rel="noopener external">
                Forum
              </a>
            </li>
            <li>
              <a href="https://twitter.com/lwjgl" rel="noopener external">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://github.com/LWJGL/lwjgl3/commits/master" rel="noopener external">
                Changelog
              </a>
            </li>
            <li>
              <a href="https://github.com/LWJGL/lwjgl3/blob/master/doc/notes/latest.md" rel="noopener external">
                Release notes
              </a>
            </li>
          </ul>
        </div>
        <div className="col-sm">
          <h3>Developers</h3>
          <ul className="list-unstyled">
            <li>
              <a href="https://github.com/LWJGL/lwjgl3" rel="noopener external">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki" rel="noopener external">
                Wiki
              </a>
            </li>
            <li>
              <a href="https://github.com/LWJGL/lwjgl3/issues" rel="noopener external">
                Issues
              </a>
            </li>
            <li>
              <a href="http://javadoc.lwjgl.org/" rel="noopener external">
                JavaDoc
              </a>
            </li>
            <li>
              <a href="http://slack.lwjgl.org/" rel="noopener external">
                Slack
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </section>
    <section className="container copyright">
      <p>
        LW<b>JGL</b> 3
      </p>
      <p>
        Licensed under <Link to="/license">BSD</Link>
      </p>
    </section>
  </footer>
);

export const Footer: React.FC<{ children?: never }> = () => {
  const location = useLocation();
  return location !== undefined && location.pathname !== '/customize' && !location.pathname.startsWith('/browse')
    ? FOOTER
    : null;
};
