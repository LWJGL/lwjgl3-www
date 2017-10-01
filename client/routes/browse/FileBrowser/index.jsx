// @flow
import * as React from 'react';
import Browser from './components/Browser';
import { register } from '~/store/asyncReducers';
import reduxSaga from '~/store/saga';
import reducer, { loadPath } from './reducer';
import saga from './saga';
import type { Task } from 'redux-saga';
import Connect from '~/store/Connect';

let sagaTask: Task;
register('browser', reducer);

class FileBrowser extends React.Component<{||}> {
  componentDidMount() {
    sagaTask = reduxSaga.run(saga);
  }

  componentWillUnmount() {
    sagaTask.cancel();
  }

  render() {
    return (
      <Connect
        state={state => ({
          ...state.browser.contents[state.browser.path],
          path: state.browser.path,
        })}
        actions={dispatch => ({
          loadPath: (path: string) => dispatch(loadPath(path)),
        })}
      >
        {(props, actions) => <Browser {...props} {...actions} />}
      </Connect>
    );
  }
}

export default FileBrowser;
