// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Checkbox from '~/components/Checkbox';
import { toggleAddon } from '../reducer';
import { MODE_ZIP } from '../constants';
import type { BuildConfig, MODES, Addon } from '../types';

type OwnProps = {
  id: string,
};

type Props = OwnProps & {
  toggleAddon: typeof toggleAddon,
  mode: MODES,
  addon: Addon,
  checked: boolean,
  showDescriptions: boolean,
};

class BuildAddon extends React.Component<Props, void> {
  toggle: () => void = () => {
    this.props.toggleAddon(this.props.id);
  };

  render() {
    const { mode, addon, checked, showDescriptions } = this.props;
    let disabled: boolean = false;
    const label: string = `${addon.title} v${addon.maven.version}`;

    if (addon.modes && addon.modes.indexOf(mode) === -1) {
      disabled = true;
    }

    if (showDescriptions) {
      return (
        <div className="artifact">
          <Checkbox label={label} checked={checked && !disabled} disabled={disabled} onChange={this.toggle} />
          <p>
            {addon.description}
          </p>
          {addon.website &&
            <p>
              <a href={addon.website} target="_blank">
                {addon.website}
              </a>
            </p>}
        </div>
      );
    } else {
      return <Checkbox label={label} checked={checked && !disabled} disabled={disabled} onChange={this.toggle} />;
    }
  }
}

export default (connect(
  ({ build }: { build: BuildConfig }, ownProps: OwnProps) => {
    const addon: Addon = build.addons.byId[ownProps.id];

    return {
      mode: build.mode,
      addon,
      checked: build.selectedAddons.includes(ownProps.id),
      showDescriptions: build.descriptions,
    };
  },
  {
    toggleAddon,
  }
)(BuildAddon): Class<React$Component<OwnProps, void>>);
