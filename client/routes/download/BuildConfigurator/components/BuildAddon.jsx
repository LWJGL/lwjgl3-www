import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from '~/components/Checkbox';
import { toggleAddon } from '../reducer';
import { MODE_ZIP } from '../constants';

class BuildAddon extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  toggle = () => {
    this.props.toggleAddon(this.props.id);
  };

  render() {
    const { mode, addon, checked, showDescriptions } = this.props;
    let disabled = false;
    let label = addon.title;

    if (addon.maven !== undefined) {
      label += ` v${addon.maven.version}`;
    } else if (mode !== MODE_ZIP) {
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

export default connect(
  ({ build }, ownProps) => {
    const addon = build.addons.byId[ownProps.id];

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
)(BuildAddon);
