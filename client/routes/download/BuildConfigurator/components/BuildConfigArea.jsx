import React from 'react';
import supportsPassive from '~/services/supports-passive';

export default class BuildConfigArea extends React.Component {
  ticking: boolean = false;
  forceUpd: boolean = false;
  container: HTMLDivElement;

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, supportsPassive ? { passive: true } : false);
    window.addEventListener('resize', this.onScroll, supportsPassive ? { passive: true } : false);
    this.update();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, supportsPassive ? { passive: true } : false);
    window.removeEventListener('resize', this.onScroll, supportsPassive ? { passive: true } : false);
  }

  componentWillUpdate() {
    this.forceUpd = true;
  }

  componentDidUpdate() {
    if (this.forceUpd) {
      setImmediate(this.update);
    }
  }

  onScroll = () => {
    if (!this.ticking) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }
  };

  update = () => {
    this.ticking = false;
    const rect = this.container.getBoundingClientRect();

    if (rect.top + rect.height > window.innerHeight) {
      this.container.classList.add('stick');
    } else {
      this.container.classList.remove('stick');
    }
  };

  getRef = (el: HTMLDivElement) => {
    this.container = el;
  };

  render() {
    return (
      <div className="build-config" ref={this.getRef}>
        {this.props.children}
      </div>
    );
  }
}
