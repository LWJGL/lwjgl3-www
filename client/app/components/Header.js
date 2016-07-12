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

  previousY = 0;
  currentY = 0;

  componentDidMount() {
    this.currentY = this.getScroll();
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  getScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  onScroll() {
    this.previousY = this.currentY;
    this.currentY = this.getScroll();
    this.nextTick();
  }

  nextTick() {
    if ( !this.ticking ) {
      requestAnimationFrame(this.update.bind(this));
    }
    this.ticking = true;
  }

  update() {
    const offsetY = this.previousY - this.currentY;
    if ( offsetY < 0 && this.currentY > 52 ) {
      this.refs.header.classList.add('hidden');
    } else {
      this.refs.header.classList.remove('hidden');
    }
    this.ticking = false;
  }

  render() {
    return (
      <header ref="header" role="navigation" className={css(this.props.isHome ? styles.home : null)}>
        <nav className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-xs-8"><IndexLink to="/">LW<b>JGL</b> 3</IndexLink></div>

            <ul className="list-unstyled col-lg-10 hidden-md-down">
              <li><IndexLink to="/">HOME</IndexLink></li>
              <li><Link to="/guide">GET STARTED</Link></li>
              <li><Link to="/download">DOWNLOAD</Link></li>
              <li><Link to="/source">SOURCE</Link></li>
              <li><a href="http://forum.lwjgl.org/">FORUM</a></li>
              <li><a href="http://blog.lwjgl.org/">BLOG</a></li>
            </ul>

            <div className="col-xs-4 hidden-lg-up text-xs-right">
              <Sidebar />
            </div>
          </div>
        </nav>
      </header>
    )
  }
}