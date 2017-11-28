// @flow
import * as React from 'react';
import type { CSSModule } from '~/services/CSSModule';

type Props = {
  loader: CSSModule,
};

export class Style extends React.Component<Props> {
  componentDidMount() {
    this.props.loader.use();
  }

  componentWillUnmount() {
    this.props.loader.unuse();
  }

  render() {
    return null;
  }
}
