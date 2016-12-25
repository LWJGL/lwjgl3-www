import React from 'react'
import { connect } from 'react-redux'
import Checkbox from '../../../../components/Checkbox'
import { toggleAddon } from '../actions'

@connect(
  ({build}, ownProps) => {
    const addon = build.addons.byId[ownProps.id];

    return {
      addon,
      checked: build.selectedAddons.includes(ownProps.id),
      showDescriptions: build.descriptions,
    }
  },
  {
    toggleAddon
  }
)
class BuildAddon extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };

  toggle = () => {
    this.props.toggleAddon(this.props.id);
  };

  render() {
    const {addon, checked, showDescriptions} = this.props;
    const label = `${addon.title} v${addon.maven.version}`;

    return do {
      if ( showDescriptions ) {
        <div className="artifact">
          <Checkbox
            label={label}
            checked={checked}
            onChange={this.toggle}
          />
          <p>{addon.description}</p>
          {addon.website && <p><a href={addon.website} target="_blank">{addon.website}</a></p>}
        </div>
      } else {
        <Checkbox
          label={label}
          checked={checked}
          onChange={this.toggle}
        />
      }
    };
  }

}

export default BuildAddon
