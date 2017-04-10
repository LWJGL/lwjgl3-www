import React from 'react';
import { string } from 'prop-types';
import withRouter from 'react-router-dom/withRouter';

@withRouter class HashLinkTarget extends React.Component {
  static propTypes = {
    id: string.isRequired,
  };

  componentDidMount() {
    if (this.props.location.hash === `#${this.props.id}`) {
      this.scrollToTarget();
    }
  }

  componentWillReceiveProps(props) {
    if (props.location !== this.props.location) {
      if (props.location.hash === `#${props.id}`) {
        this.scrollToTarget();
      } else {
        scroll(0, 0);
      }
    }
  }

  scrollToTarget() {
    try {
      document.getElementById(this.props.id).scrollIntoView({ behavior: 'smooth' });
    } catch (ignore) {}
  }

  render() {
    return (
      <a
        ref={el => {
          this.el = el;
        }}
        id={this.props.id}
      />
    );
  }
}

export default HashLinkTarget;
