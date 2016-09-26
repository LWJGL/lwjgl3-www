import React from 'react'
import RadioGroup from './RadioGroup'
import Radio from './Radio'

class ControlledRadio extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
  };

  select = (value) => {
    this.props.store.setOption(this.props.name, value);
  };

  render() {
    const radios = this.props.store.getOptions(this.props.name);

    return (
      <RadioGroup name={this.props.name} value={this.props.store[this.props.name]} onChange={this.select}>
        {
          radios.map(
            (radio, i) => <Radio key={`${this.props.name}${i}`} value={radio.value} label={radio.label} disabled={radio.disabled} />
          )
        }
      </RadioGroup>
    )
  }

}

export default ControlledRadio
