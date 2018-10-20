// @flow
import * as React from 'react';
import { PageBlank } from './PageBlank';
import { PageError } from './PageError';
import { delay } from '~/services/delay';

type LoadingError = Error | null;

type Props = {};

type State = {
  error: LoadingError,
  loading: boolean,
};

export const getAsyncRoute = (loader: ComponentImport) => {
  class AsyncRoute extends React.Component<Props, State> {
    static Route = null;
    static preload() {
      loader();
    }

    mounted = false;
    state = {
      error: null,
      loading: AsyncRoute.Route === null,
    };

    safeSetState(state: $Shape<State>) {
      if (this.mounted) {
        this.setState(state);
      }
    }

    constructor(props: Props) {
      super(props);

      if (AsyncRoute.Route === null) {
        loader()
          .then(module => {
            AsyncRoute.Route = module.default;
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
      const { error, loading } = this.state;

      if (error) {
        return <PageError error={error} />;
      } else if (loading) {
        return <PageBlank delay={200} />;
      } else if (AsyncRoute.Route !== null) {
        return <AsyncRoute.Route {...this.props} />;
      } else {
        return null;
      }
    }
  }

  return AsyncRoute;
};
