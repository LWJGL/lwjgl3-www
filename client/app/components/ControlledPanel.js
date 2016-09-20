import React from 'react'
import {observer} from 'mobx-react'

@observer(['store'])
class ControlledPanel extends React.Component {

  static propTypes = {
    visible: React.PropTypes.func.isRequired,
    getClassName: React.PropTypes.func,
  };

  static defaultProps = {
    visible: () => true
  };

  render() {
    const { visible, children, store, getClassName, ...rest } = this.props;

    if ( !visible(store) ) {
      rest.style = {
        display: 'none'
      };
    }

    if ( typeof getClassName === 'function' ) {
      rest.className = getClassName(store);
    }

    return (
      <div {...rest}>
        {children}
      </div>
    )
  }

}

export default ControlledPanel