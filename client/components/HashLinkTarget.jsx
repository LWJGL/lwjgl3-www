// @flow
import * as React from 'react';
import { Route, type Location } from 'react-router-dom';
import smoothScroll from '~/services/smoothscroll';

type OwnProps = {|
  id: string,
|};

type Props = {|
  ...OwnProps,
  location: Location,
|};

class HashLinkTarget extends React.Component<Props> {
  componentDidMount() {
    if (this.props.location.hash === `#${this.props.id}`) {
      this.scrollToTarget();
    }
  }

  componentWillReceiveProps({ location, id }: Props) {
    if (location !== this.props.location) {
      if (location.hash === `#${id}`) {
        this.scrollToTarget();
      } else {
        window.scroll(0, 0);
      }
    }
  }

  scrollToTarget() {
    const el = document.getElementById(this.props.id);
    if (el !== null) {
      smoothScroll.init();
      try {
        el.scrollIntoView();
      } catch (ignore) {}
      smoothScroll.play();
    }
  }

  render() {
    return <a id={this.props.id} />;
  }
}

const HashLinkTargetRoute = ({ id }: OwnProps) => (
  <Route render={({ location }) => <HashLinkTarget id={id} location={location} />} />
);

export default HashLinkTargetRoute;
