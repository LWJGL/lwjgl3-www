// @flow
import * as React from 'react';

type Props = {};
type LoadingError = Error | null;
type State = {
  error: LoadingError,
  loading: boolean,
};
export type ComponentImport = () => Promise<{ default: React.ComponentType<any> }>;
export type AsyncRenderOptions = {
  error: LoadingError,
  loading: boolean,
  Component: React.ComponentType<any> | null,
  ownProps: any,
};
export type AsyncRenderProps = {
  error: LoadingError,
};
export type AsyncRender = (options: AsyncRenderOptions) => React.Node;

const defaultRender = ({ Component, ownProps }: AsyncRenderOptions): React.Node =>
  Component !== null ? <Component {...ownProps} /> : null;

export function renderAsync(getComponent: ComponentImport, renderComponent: AsyncRender = defaultRender) {
  class Async extends React.Component<Props, State> {
    static Component = null;
    static loadingPromise = null;

    static load() {
      if (!Async.loadingPromise) {
        Async.loadingPromise = getComponent()
          .then(module => {
            Async.Component = module.default;
            // return module.default;
          })
          .catch(error => {
            Async.loadingPromise = null;
            throw error;
          });
      }

      return Async.loadingPromise;
    }

    state = {
      error: null,
      loading: Async.Component === null,
    };
    mounted = false;

    safeSetState(state: $Shape<State>) {
      if (this.mounted) {
        this.setState(state);
      }
    }

    constructor(props: Props) {
      super(props);

      if (Async.Component === null && Async.loadingPromise === null) {
        Async.load()
          .then(() => {
            this.safeSetState({ loading: false });
          })
          .catch(error => {
            this.safeSetState({ error, loading: false });
          });
      }
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      return renderComponent({
        ...this.state,
        Component: Async.Component,
        ownProps: this.props,
      });
    }
  }

  return Async;
}
