import React from 'react'
import {Link, IndexLink} from 'react-router/es6'
import Sidebar from './Sidebar'

export default class Header extends React.Component {

  previousY = 0;
  currentY = 0;
  dynamicMenu = false;

  componentDidMount() {
    this.currentY = this.getScroll();
    this.dynamicMenu = this.props.isHome;
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.dynamicMenu = nextProps.isHome;
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
    if ( this.dynamicMenu )  {
      if ( this.currentY > 52 ) {
        this.refs.header.classList.remove('home');
      } else {
        this.refs.header.classList.add('home');
      }
    }
    this.ticking = false;
  }

  render() {
    return (
      <header ref="header" role="navigation" className={this.props.isHome ? 'home' : 'other'}>
        <nav className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-xs-8"><IndexLink to="/">LW<b>JGL</b> 3</IndexLink></div>

            <ul className="list-unstyled col-lg-10 hidden-md-down" role="menu">
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