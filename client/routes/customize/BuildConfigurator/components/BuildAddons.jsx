// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import BuildAddon from './BuildAddon';
import type { BuildConfig } from '../types';

type Props = {
  addons: Array<string>,
};

class BuildAddons extends React.Component<Props> {
  render() {
    const { addons } = this.props;

    return <div className="custom-controls-stacked">{addons.map((it: string) => <BuildAddon key={it} id={it} />)}</div>;
  }
}

export default connect(({ build }: { build: BuildConfig }) => ({
  addons: build.addons.allIds,
}))(BuildAddons);
