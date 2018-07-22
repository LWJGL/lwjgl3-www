// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  children: React.Node,
};

/**
 * This component detaches its contents and re-attaches them to document.body (using ReactDOM.createPortal).
 * Use it when you need to circumvent DOM z-stacking (for dialogs, popovers, etc.).
 * Any class names passed to this element will be propagated to the new container element on document.body.
 */
export class Portal extends React.Component<Props, void> {
  targetElement: HTMLElement | null = null;

  render() {
    if (this.targetElement === null && document.body) {
      this.targetElement = document.body.appendChild(document.createElement('div'));
    }

    return this.targetElement !== null ? ReactDOM.createPortal(this.props.children, this.targetElement) : null;
  }

  componentWillUnmount() {
    if (this.targetElement !== null && document.body) {
      document.body.removeChild(this.targetElement);
      this.targetElement = null;
    }
  }
}
