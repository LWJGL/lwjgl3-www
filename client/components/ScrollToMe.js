import React from 'react';

type Props = {
  location: 'string',
};

class ScrollToMe extends React.Component<void, Props, void> {
  el: HTMLDivElement;

  componentDidMount() {
    this.scroll();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location !== this.props.location) {
      this.scroll();
    }
  }

  scroll() {
    window.scrollTo(0, this.el.offsetTop);
  }

  render() {
    return (
      <div
        ref={n => {
          this.el = n;
        }}
      />
    );
  }
}

export default ScrollToMe;
