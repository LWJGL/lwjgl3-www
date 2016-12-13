import React from 'react'
import supportsPassive from '../../../../services/supports-passive'
import { connect } from 'react-redux'

@connect(
  ({build}) => ({
    mode: build.mode,
  })
)
class BuildConfigArea extends React.Component {

  ticking = false;
  forceUpdate = false;

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, supportsPassive ? {passive: true} : false);
    this.update();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, supportsPassive ? {passive: true} : false);
  }

  componentWillUpdate() {
    this.forceUpdate = true;
  }

  componentDidUpdate() {
    if ( this.forceUpdate ) {
      setImmediate(this.update);
    }
  }

  onScroll = () => {
    if ( !this.ticking ) {
      requestAnimationFrame(this.update);
      this.ticking = true;
    }
  };

  update = () => {
    this.ticking = false;
    const rect = this.container.getBoundingClientRect();

    if ( rect.top + rect.height > window.innerHeight ) {
      this.container.classList.add('stick');
    } else {
      this.container.classList.remove('stick');
    }
  };

  render() {
    return (
      <div className="build-config" ref={el => {this.container = el}}>
        {this.props.children}
      </div>
    );
  }

}

export default BuildConfigArea
