// @flow
import * as React from 'react';
import ResizeObserver, { type Entry } from 'resize-observer-polyfill';

type Props = {
  children: (width: number, height: number) => React.Node,
};

type State = {
  width: number,
  height: number,
};

export default class ResizeObservable extends React.Component<Props, State> {
  observer: ?ResizeObserver;
  handleRef = React.createRef();

  state = {
    width: 0,
    height: 0,
  };

  componentDidMount() {
    this.observer = new ResizeObserver(this.handleResize.bind(this));
    if (this.handleRef.current != null) {
      this.observer.observe(this.handleRef.current);
    }
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
