import React from 'react'
import { Link, IndexLink } from 'react-router'

export default class extends React.Component {
  render() {
    return (
      <footer className="container p-y-2">
        <nav className="row">
          <div className="col-sm-3 col-xs-12">
            <h3>About</h3>
            <ul className="list-unstyled fa-ul">
              <li><i className="fa-li fa fa-home" /> <IndexLink to="/">Home</IndexLink></li>
              <li><i className="fa-li fa fa-cube" /> <Link to="/guide">Get Started</Link></li>
              <li><i className="fa-li fa fa-cloud-download" /> <Link to="/download">Download</Link></li>
              <li><i className="fa-li fa fa-code" /> <Link to="/source">Source</Link></li>
              <li><i className="fa-li fa fa-legal" /> <Link to="/license">License</Link></li>
            </ul>
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3>News</h3>
            <ul className="list-unstyled fa-ul">
              <li><i className="fa-li fa fa-newspaper-o" /> <a href="http://blog.lwjgl.org/">Blog</a></li>
              <li><i className="fa-li fa fa-group" /> <a href="http://forum.lwjgl.org/">Forum</a></li>
              <li><i className="fa-li fa fa-twitter" /> <a href="https://twitter.com/lwjgl" rel="external nofollow">Twitter</a></li>
              <li><i className="fa-li fa fa-clock-o" /> <a href="https://github.com/LWJGL/lwjgl3/commits/master">ChangeLog</a></li>
              <li><i className="fa-li fa fa-file-text-o" /> <a href="https://github.com/LWJGL/lwjgl3/blob/master/doc/notes/latest.md">Release notes</a></li>
            </ul>
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3>Developers</h3>
            <ul className="list-unstyled fa-ul">
              <li><i className="fa-li fa fa-github" /> <a href="https://github.com/LWJGL/lwjgl3">GitHub</a></li>
              <li><i className="fa-li fa fa-book" /> <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki">Wiki</a></li>
              <li><i className="fa-li fa fa-bug" /> <a href="https://github.com/LWJGL/lwjgl3/issues">Issues</a></li>
              <li><i className="fa-li fa fa-file-code-o" /> <a href="http://javadoc.lwjgl.org/">JavaDoc</a></li>
            </ul>
          </div>
          <div className="col-sm-3 col-xs-12">
            <h3>Sponsor</h3>
            <a href="https://www.webhotelier.net/" title="WebHotelier"><img className="img-fluid" width={143} height={30} src="https://dloycpjzg76ow.cloudfront.net/images/brand/webhotelier-logo@x2.png" alt="WebHotelier" /></a>
          </div>
        </nav>
      </footer>
    )
  }
}