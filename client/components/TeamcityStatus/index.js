import React from 'react'
import { css } from 'aphrodite/no-important'
import { connect } from 'react-redux'
import styles from './styles'
import LoaderSpinner from '../LoaderSpinner'
import { loadStatus } from './reducer'

@connect(
  (state, props) => ({
    status: 'loading',
    ...state.teamcityStatus[props.name]
  }),
  {
    loadStatus
  }
)
class BuildStatus extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired
  };

  componentDidMount() {
    const { status, loadStatus, name } = this.props;

    if ( status === 'loading' ) {
      loadStatus(name);
    }
  }

  render() {
    const { status, build } = this.props;

    return (
      <div className={css(styles.container)}>
        <span className={css(styles.common, styles.build)}>build</span>
        <span className={css(styles.common, styles.status, styles[status])}>
          {status}
          {status === 'loading' ? <LoaderSpinner size={14} style={{marginLeft: 4, stroke: 'white'}} /> : null }
        </span>
        {build === undefined ? null : (<small style={{color: 'gray'}}> #{build}</small>) }
      </div>
    )
  }

}

export default BuildStatus
