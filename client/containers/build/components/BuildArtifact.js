import React from 'react'
import {connect} from 'react-redux'
import Checkbox from '../../../components/Checkbox'
import { toggleArtifact } from '../actions'

@connect(
  (state, ownProps) => ({
    artifact: state.build.artifacts.byId[ownProps.id],
    checked: state.build.contents[ownProps.id] === true,
    descriptions: state.build.descriptions,
    // disabled: state.build.platform !==
  }),
  dispatch => ({
    toggleArtifact: value => dispatch(toggleArtifact(value))
  })
)
class ControlledArtifact extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
  };

  toggle = () => {
    this.props.toggleArtifact(this.props.id);
  };

  render() {
    // const option = this.props.store.getArtifactOptions(this.props.name);
    const { artifact, checked, descriptions } = this.props;

    return (
      <div>
        <Checkbox
          label={artifact.title}
          disabled={false}
          checked={checked}
          onChange={this.toggle}
        />
        {
          descriptions
            ?
            <p className="m-b-2" style={{marginTop: '-1rem'}}>
              <small>{artifact.description}</small>
            </p>
            : null
        }
      </div>
    )
  }

}

export default ControlledArtifact
