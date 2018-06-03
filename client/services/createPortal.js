// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';

export function createPortal() {
  const node = document.createElement('div');

  class Portal extends React.Component<{ children: React.Node }> {
    render() {
      return ReactDOM.createPortal(this.props.children, node);
    }
  }

  class Target extends React.Component<{||}> {
    rootRef = React.createRef();
    render() {
      return <div ref={this.rootRef} />;
    }
    componentDidMount() {
      //$FlowFixMe
      this.rootRef.current.appendChild(node);
    }
  }

  return { Portal, Target };
}
