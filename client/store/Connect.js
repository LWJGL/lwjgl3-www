// @flow
import * as React from 'react';
import { bindActionCreators, type Dispatch, type DispatchAPI } from 'redux';
import store from './';

type Actions = {
  [string]: Function,
};

type mapDispatchToProps = { [string]: DispatchAPI<*> } | ((dispatch: Dispatch<*>) => Actions);

type Props = {
  state: (state: Object) => {},
  actions?: mapDispatchToProps,
  children: (state: Object, actions: ?Actions) => React.Node,
};

class Connect extends React.PureComponent<Props, Object> {
  unsubscribe: () => void;
  actions: ?Actions;

  storeListener = () => {
    this.setState(this.props.state(store.getState()));
  };

  mapDispatch(actions: mapDispatchToProps): Actions {
    if (typeof actions === 'function') {
      return actions(store.dispatch);
    }

    return bindActionCreators(actions, store.dispatch);
  }

  constructor(props: Props) {
    super(props);
    this.actions = this.props.actions ? this.mapDispatch(this.props.actions) : undefined;
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
