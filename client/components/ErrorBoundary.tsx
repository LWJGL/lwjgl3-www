// @flow
import * as React from 'react';

interface ReactErrorInfo {
  componentStack: string,
};

export interface ErrorProps {
  error: Error,
  info?: ReactErrorInfo,
};

interface Props {
  children?: React.ReactNode,
  render: React.ComponentType<ErrorProps>,
};

type State = {
  hasError: boolean,
  error?: Error,
  info?: ReactErrorInfo,
};

export class ErrorBoundary extends React.Component<Props, State> {
  state = {
    hasError: false,
    error: undefined,
    info: undefined,
  };

  componentDidCatch(error: Error, info: ReactErrorInfo) {
    this.setState({ hasError: true, error, info });
  }

  render() {
    const { children, render: Component } = this.props;
    const { hasError, error, info } = this.state;

    if (hasError && error !== undefined) {
      return <Component error={error} info={info} />;
    } else {
      return children !== undefined ? children : null;
    }
  }
}
