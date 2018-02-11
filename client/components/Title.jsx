// @flow
import * as React from 'react';

type Props = {
  children?: string,
};

export class Title extends React.PureComponent<Props> {
  componentDidMount() {
    document.title =
      this.props.children !== undefined ? `${this.props.children} - LWJGL` : 'LWJGL - Lightweight Java Game Library';
  }

  render() {
    return null;
  }
}
