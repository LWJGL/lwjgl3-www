// @flow
import * as React from 'react';
import cc from 'classcat';

type Props = {
  className?: string,
};

type State = {
  mounted: boolean,
};

export class Backdrop extends React.PureComponent<Props, State> {
  state = {
    mounted: false,
  };

  componentDidMount() {
    this.setState({
      mounted: true,
    });
  }

  render() {
    return <div className={cc(['overlay-backdrop', this.props.className, { open: this.state.mounted }])} />;
  }
}
