import React from 'react'
import Link from 'react-router-dom/Link'

const Footer = () => (
  <footer>
    <div className="container">
      <nav className="row">
        <div className="col-sm">
          <h3>About</h3>
          <ul className="list-unstyled">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/guide">Get Started</Link></li>
            <li><Link to="/download">Download</Link></li>
            <li><Link to="/source">Source</Link></li>
            <li><Link to="/license">License</Link></li>
          </ul>
        </div>
        <div className="col-sm">
          <h3>News</h3>
          <ul className="list-unstyled">
            <li><a href="http://blog.lwjgl.org/">Blog</a></li>
            <li><a href="http://forum.lwjgl.org/">Forum</a></li>
            <li><a href="https://twitter.com/lwjgl" rel="external nofollow">Twitter</a></li>
            <li><a href="https://github.com/LWJGL/lwjgl3/commits/master">Changelog</a></li>
            <li><a href="https://github.com/LWJGL/lwjgl3/blob/master/doc/notes/latest.md">Release notes</a></li>
          </ul>
        </div>
        <div className="col-sm">
          <h3>Developers</h3>
          <ul className="list-unstyled">
            <li><a href="https://github.com/LWJGL/lwjgl3">GitHub</a></li>
            <li><a href="https://github.com/LWJGL/lwjgl3-wiki/wiki">Wiki</a></li>
            <li><a href="https://github.com/LWJGL/lwjgl3/issues">Issues</a></li>
            <li><a href="http://javadoc.lwjgl.org/">JavaDoc</a></li>
            <li><a href="https://slack.lwjgl.org/">Slack</a></li>
          </ul>
        </div>
        <div className="col-sm">
          <h3>Sponsor</h3>
          <a href="https://www.webhotelier.net/" title="WebHotelier" rel="external">
            <img className="mb-2" alt="WebHotelier" src="/svg/webhotelier.svg" />
          </a>
        </div>
      </nav>
    </div>
  </footer>
);

export default Footer
