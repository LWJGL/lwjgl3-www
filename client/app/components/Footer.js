import React from 'react'
import { Link, IndexLink } from 'react-router/es6'

export default class Footer extends React.PureComponent {
  render() {
    return (
      <footer className="container p-y-2">
        <nav className="row">
          <div className="col-sm-3 col-xs-12">
            <h3>About</h3>
            <ul className="list-unstyled">
              <li><IndexLink to="/">Home</IndexLink></li>
              <li><Link to="/guide">Get Started</Link></li>
              <li><Link to="/download">Download</Link></li>
              <li><Link to="/source">Source</Link></li>
              <li><Link to="/license">License</Link></li>
            </ul>
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3>News</h3>
            <ul className="list-unstyled">
              <li><a href="http://blog.lwjgl.org/">Blog</a></li>
              <li><a href="http://forum.lwjgl.org/">Forum</a></li>
              <li><a href="https://twitter.com/lwjgl" rel="external nofollow">Twitter</a></li>
              <li><a href="https://github.com/LWJGL/lwjgl3/commits/master">ChangeLog</a></li>
              <li><a href="https://github.com/LWJGL/lwjgl3/blob/master/doc/notes/latest.md">Release notes</a></li>
            </ul>
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3>Developers</h3>
            <ul className="list-unstyled">
              <li><a href="https://github.com/LWJGL/lwjgl3">GitHub</a></li>
              <li><a href="https://github.com/LWJGL/lwjgl3-wiki/wiki">Wiki</a></li>
              <li><a href="https://github.com/LWJGL/lwjgl3/issues">Issues</a></li>
              <li><a href="http://javadoc.lwjgl.org/">JavaDoc</a></li>
            </ul>
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3>Sponsor</h3>
            <a href="https://www.webhotelier.net/" title="WebHotelier">
              <img
                className="img-fluid" width={140} height={29} alt="WebHotelier"
                src="//d2g0ezo1t7nqa0.cloudfront.net/img/webhotelier-logo@x1.png"
                srcSet="//d2g0ezo1t7nqa0.cloudfront.net/img/webhotelier-logo@x1.png 1x,//d2g0ezo1t7nqa0.cloudfront.net/img/webhotelier-logo@x2.png 2x,//d2g0ezo1t7nqa0.cloudfront.net/img/webhotelier-logo@x4.png 3x"
              />
            </a>
          </div>
        </nav>
      </footer>
    )
  }
}