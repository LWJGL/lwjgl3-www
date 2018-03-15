// @flow
import * as React from 'react';

type Props = {
  location: 'string',
};

export class ScrollToMe extends React.Component<Props> {
  componentDidMount() {
    this.scroll();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location !== this.props.location) {
      this.scroll();
    }
  }

  scroll() {
    if (this.divRef.current != null) {
      window.scrollTo(0, this.divRef.current.offsetTop);
    }
  }

  //$FlowFixMe
  divRef = React.createRef();

  render() {
    return <div ref={this.divRef} />;
  }
}
