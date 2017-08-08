import React from 'react';
import { connect } from 'react-redux';
import BuildAddon from './BuildAddon';
import type { BuildConfig } from '../types';

type AddonData = {
  addons: Array<string>,
};

class BuildAddons extends React.Component {
  render() {
    const { addons }: AddonData = this.props;

    return (
      <div className="custom-controls-stacked">
        {addons.map((it: string) => <BuildAddon key={it} id={it} />)}
      </div>
    );
  }
}

export default connect(
  ({ build }: { build: BuildConfig }) =>
    ({
      addons: build.addons.allIds,
    }: AddonData)
)(BuildAddons);
