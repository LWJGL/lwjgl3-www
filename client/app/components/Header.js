import React from 'react'
import {Link, IndexLink} from 'react-router/es6'
import {StyleSheet, css} from 'aphrodite'
import Sidebar from './Sidebar'

const styles = StyleSheet.create({
  home: {
    backgroundColor: 'transparent',
    position: 'absolute'
  }
});

export default class extends React.Component {
  render() {
    return (
      <header role="navigation" className={css(this.props.isHome ? styles.home : null)}>
        <nav className="container-fluid">
          <div className="row">
            <div className="col-md-2 col-xs-8"><IndexLink to="/">LW<b>JGL</b> 3</IndexLink></div>

            <ul className="list-unstyled col-md-10 hidden-sm-down">
              <li><IndexLink to="/">HOME</IndexLink></li>
              <li><Link to="/guide">GET STARTED</Link></li>
              <li><Link to="/download">DOWNLOAD</Link></li>
              <li><Link to="/source">SOURCE</Link></li>
              <li><a href="http://forum.lwjgl.org/">FORUM</a></li>
              <li><a href="http://blog.lwjgl.org/">BLOG</a></li>
            </ul>

            <div className="col-xs-4 hidden-md-up text-xs-right">
              <Sidebar />
            </div>
          </div>
        </nav>
      </header>
    )
  }
}