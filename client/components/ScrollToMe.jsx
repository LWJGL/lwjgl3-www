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
    if (this.divRef.value != null) {
      window.scrollTo(0, this.divRef.value.offsetTop);
    }
  }

  //$FlowFixMe
  divRef = React.createRef();

  render() {
    return <div ref={this.divRef} />;
  }
}
