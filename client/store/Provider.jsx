// @flow
import * as React from 'react';
import { type Dispatch } from 'redux';
import { store } from './';

type Props = {
  children: React.Node,
};

export const StoreContext = React.createContext({});

export class Provider extends React.Component<Props> {
  state = store.getState();

  unsubscribe: Function | null = null;

  updateState = this.updateState.bind(this);
  updateState() {
    this.setState(prevState => {
      const nextState = store.getState();
      return nextState === prevState ? null : nextState;
    });
  }

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
