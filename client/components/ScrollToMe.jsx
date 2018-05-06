// @flow
import * as React from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

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
      scrollIntoView(this.divRef.current, {
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }

  divRef = React.createRef();

  render() {
    return <div ref={this.divRef} />;
  }
}
