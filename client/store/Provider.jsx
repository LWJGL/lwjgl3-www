// @flow
import * as React from 'react';
import { type Dispatch } from 'redux';
import { store } from './';
import { StoreContext } from './Context';

type Props = {
  children: React.Node,
};

type State = {
  storeState: Object,
};

export class Provider extends React.Component<Props, State> {
  state = store.getState();

  unsubscribe: Function | null = null;

  updateState = () => {
    const storeState = store.getState();

    if (storeState !== this.state) {
      this.setState(storeState);
    }
  };

  componentDidMount() {
    this.unsubscribe = store.subscribe(this.updateState);
  }

  componentWillUnmount() {
    if (this.unsubscribe !== null) {
      this.unsubscribe();
    }
  }

  render() {
    return <StoreContext.Provider value={this.state}>{React.Children.only(this.props.children)}</StoreContext.Provider>;
  }
}