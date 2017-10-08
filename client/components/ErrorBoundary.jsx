// @flow
import * as React from 'react';

type ReactErrorInfo = {
  componentStack: string,
};

export type ErrorProps = {
  error: Error,
  info: ReactErrorInfo,
};

type Props = {
  children: React.Node,
  render: React.ComponentType<ErrorProps>,
};

type State = {
  hasError: boolean,
  error?: Error,
  info?: ReactErrorInfo,
};

class ErrorBoundary extends React.Component<Props, State> {
  state = {
    hasError: false,
  };

  componentDidCatch(error: Error, info: ReactErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
    this.setState({ hasError: true, error, info });
  }

  render() {
    if (this.state.hasError && this.state.error !== undefined && this.state.info !== undefined) {
      const Component = this.props.render;
      const { error, info } = this.state;
      return <Component error={error} info={info} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
