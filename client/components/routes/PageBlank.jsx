// @flow
import * as React from 'react';
import { start, end } from '../NavProgress';

type Props = {
  delay: number,
};

export class PageBlank extends React.Component<Props> {
  static defaultProps = {
    delay: 0,
  };

  componentDidMount() {
    start(this.props.delay);
  }

  componentWillUnmount() {
    end();
  }

  render() {
    return <div style={{ padding: '5rem 0', minHeight: 'calc(100vh - 4rem)' }} />;
  }
}
