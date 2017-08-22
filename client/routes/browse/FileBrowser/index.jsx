// @flow
import * as React from 'react';
import Browser from './components/Browser';
import { register } from '~/store/asyncReducers';
import reduxSaga from '~/store/saga';
import reducer from './reducer';
import saga from './saga';
import type { Task } from 'redux-saga';

let sagaTask: Task;

class FileBrowser extends React.Component<{}> {
  componentDidMount() {
    sagaTask = reduxSaga.run(saga);
  }
  componentWillUnmount() {
    sagaTask.cancel();
  }

  render() {
    return <Browser />;
  }
}

register('browser', reducer);

export default FileBrowser;
