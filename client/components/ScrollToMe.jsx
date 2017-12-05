// @flow
import * as React from 'react';

type Props = {
  location: 'string',
};

export class ScrollToMe extends React.Component<Props> {
  el: ?HTMLDivElement;

  constructor(props: Props) {
    super(props);
    (this: any).getRef = this.getRef.bind(this);
  }

  componentDidMount() {
    this.scroll();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location !== this.props.location) {
      this.scroll();
    }
  }

  scroll() {
    if (this.el != null) {
      window.scrollTo(0, this.el.offsetTop);
    }
  }

  getRef(n: ?HTMLDivElement) {
    this.el = n;
  }

  render() {
    return <div ref={this.getRef} />;
  }
}
