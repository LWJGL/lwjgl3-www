// @flow
import * as React from 'react';
import type { Dispatch } from 'redux';
import store from './';

type Actions = {
  [string]: Function,
};

type Props = {
  state: (state: Object) => {},
  actions?: (dispatch: Dispatch<*>) => Actions,
  children: (state: Object, actions: Actions | null) => React.Node,
};

class Connect extends React.PureComponent<Props, Object> {
  unsubscribe: () => void;
  actions: Actions | null = null;

  storeListener = () => {
    this.setState(this.props.state(store.getState()));
  };

  constructor(props: Props) {
    super(props);
    if (this.props.actions) {
      this.actions = this.props.actions(store.dispatch);
    }
    this.state = this.props.state(store.getState());
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(this.storeListener);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return this.props.children(this.state, this.actions);
  }
}

export default Connect;
