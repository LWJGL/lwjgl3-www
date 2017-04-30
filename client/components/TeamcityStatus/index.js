import React from 'react';
import { connect } from 'react-redux';
import reduxSaga from '../../store/saga';
import { css } from 'aphrodite/no-important';
import styles from './styles';
import LoaderSpinner from '../LoaderSpinner';
import { loadStatus, saga } from './reducer';
import type { Task } from 'redux-saga';
import type { TcStatus, TcStatusObject } from './reducer';
import typeof { loadStatus as LoadStatus } from './reducer';

type OwnProps = {
  name: string,
};

type ConnectProps = OwnProps &
  TcStatusObject & {
    loadStatus: LoadStatus,
  };

let instances = 0;
let sagaTask: Task | null = null;

class BuildStatus extends React.Component<void, ConnectProps, void> {
  componentDidMount() {
    const { status, loadStatus, name } = this.props;

    if (instances === 0) {
      sagaTask = reduxSaga.run(saga);
    }
    instances += 1;

    if (status === 'loading') {
      loadStatus(name);
    }
  }

  componentWillUnmount() {
    instances -= 1;
    if (instances === 0 && sagaTask !== null) {
      sagaTask.cancel();
    }
  }

  render() {
    const { status, build } = this.props;

    return (
      <div className={css(styles.container)}>
        <span className={css(styles.common, styles.build)}>build</span>
        <span className={css(styles.common, styles.status, styles[status])}>
          {status}
          {status === 'loading' && <LoaderSpinner size={14} style={{ marginLeft: 4, stroke: 'white' }} />}
        </span>
        {build != null && <small style={{ color: 'gray' }}> #{build}</small>}
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    status: 'loading',
    ...state.teamcityStatus[props.name],
  }),
  {
    loadStatus,
  }
)(BuildStatus);
