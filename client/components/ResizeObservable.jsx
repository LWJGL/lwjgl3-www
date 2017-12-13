// @flow
import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type Entry = {
  +contentRect: {
    +width: number,
    +height: number,
  },
};

type Props = {
  children: (width: number, height: number) => React.Node,
};

type State = {
  width: number,
  height: number,
};

export default class ResizeObservable extends React.Component<Props, State> {
  observer: ?ResizeObserver;
  el: ?HTMLElement;

  constructor(props: Props) {
    super(props);
    this.state = { width: 0, height: 0 };
    (this: any).handleRef = this.handleRef.bind(this);
  }

  componentDidMount() {
    this.observer = new ResizeObserver(this.handleResize.bind(this));
    this.observer.observe(this.el);
  }

  componentWillUnmount() {
    if (this.observer != null) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  handleResize(entries: $ReadOnlyArray<Entry>) {
    const { width, height } = entries[0].contentRect;
    this.setState({ width, height });
  }

  handleRef(elem: ?HTMLElement) {
    this.el = elem;
  }

  render() {
    const { children, ...restProps } = this.props;
    const { width, height } = this.state;

    return (
      <div {...restProps} ref={this.handleRef}>
        {children(width, height)}
      </div>
    );
  }
}
