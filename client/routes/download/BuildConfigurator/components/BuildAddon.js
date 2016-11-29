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

    return showDescriptions ? (
      <div>
        <Checkbox
          label={label}
          checked={checked}
          onChange={this.toggle}
        />
        <p><small>{addon.description} <a href={addon.about} target="_blank">learn more</a></small></p>
      </div>
    ) : (
      <Checkbox
        label={label}
        checked={checked}
        onChange={this.toggle}
      />
    );
  }

}

export default BuildAddon
