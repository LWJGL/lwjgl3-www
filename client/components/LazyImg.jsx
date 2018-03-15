// @flow
import * as React from 'react';
import { SupportsIntersectionObserver } from '~/services/supports';

function observeEntries(entries: Array<IntersectionObserverEntry>) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      // $FlowFixMe
      const instance: LazyImg = LazyImg.map.get(entry.target);
      if (instance !== undefined) {
        const { src, srcSet } = instance.props;
        instance.setState({ src, srcSet }, instance.unobserve);
      }
    }
  });
}

type Props = {
  src?: string,
  srcSet?: string,
};

export class LazyImg extends React.PureComponent<Props, Props> {
  static io: IntersectionObserver | null = null;
  static map: WeakMap<?HTMLImageElement, LazyImg> = new WeakMap();
  static mapCount: number = 0;
  observed: boolean = false;

  state = {};
  //$FlowFixMe
  imgRef = React.createRef();

  componentDidMount() {
    if (!SupportsIntersectionObserver) {
      this.setState({
        src: this.props.src,
        srcSet: this.props.srcSet,
      });
      return;
    }

    const el: ?HTMLImageElement = this.imgRef.current;

    if (el != null) {
      if (LazyImg.io === null) {
        // Lazily create IO
        LazyImg.io = new IntersectionObserver(observeEntries, {
          threshold: 0,
          rootMargin: '400px',
        });
      }

      LazyImg.io.observe(el);
      LazyImg.map.set(el, this);
      this.observed = true;
      LazyImg.mapCount += 1;
    }
  }

  unobserve() {
    if (this.observed) {
      this.observed = false;

      const el: ?HTMLImageElement = this.imgRef.current;

      if (el != null && LazyImg.io !== null) {
        LazyImg.io.unobserve(el);
        LazyImg.map.delete(el);
        LazyImg.mapCount -= 1;

        if (LazyImg.mapCount === 0) {
          // We don't need this IO anymore
          LazyImg.io = null;
        }
      }
    }
  }

  componentWillUnmount() {
    this.unobserve();
  }

  render() {
    // extract DOM properties to ...rest
    const { src, srcSet, ...rest } = this.props;
    return <img ref={this.imgRef} src={this.state.src} srcSet={this.state.srcSet} {...rest} />;
  }
}
