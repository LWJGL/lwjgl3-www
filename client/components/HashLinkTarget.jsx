// @flow
import * as React from 'react';
import { Location, type RouterLocation } from '@reach/router';
import scrollIntoView from 'scroll-into-view-if-needed';

type OwnProps = {|
  id: string,
|};

type Props = {|
  ...OwnProps,
  location: RouterLocation,
|};

// Remember position before we clicked on a HashLink
let defaultScrollPos = [0, 0];
// Avoid calling reset position more than once when multiple <HashLinkTarget /> are on page
let scrolling = false;

const scrollEnd = () => {
  scrolling = false;
};

export class HashLinkTargetControlled extends React.Component<Props> {
  componentDidMount() {
    if (this.props.location.hash === `#${this.props.id}`) {
      this.scrollToTarget();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const currentHash = this.props.location.hash;
    const prevHash = prevProps.location.hash;
    if (prevHash !== currentHash) {
      if (currentHash === `#${this.props.id}`) {
        if (prevHash === '') {
          defaultScrollPos = [window.pageXOffset, window.pageYOffset];
        }
        scrolling = true;
        this.scrollToTarget();
      } else if (!scrolling) {
        scrolling = true;
        if (defaultScrollPos[1] === 0) {
          if (document.body != null) {
            scrollIntoView(document.body, {
              behavior: 'smooth',
              block: 'start',
              inline: 'start',
            });
          }
        } else {
          window.scroll.apply(window, defaultScrollPos);
        }
        setTimeout(scrollEnd, 0);
      }
    }
  }

  scrollToTarget() {
    const el = document.getElementById(this.props.id);
    if (el !== null) {
      scrollIntoView(el, {
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
      setTimeout(scrollEnd, 0);
    }
  }

  render() {
    return <a id={this.props.id} />;
  }
}

export const HashLinkTarget = ({ id }: OwnProps) => (
  <Location>{({ location }) => <HashLinkTargetControlled id={id} location={location} />}</Location>
);
