import React from 'react';

interface ReactErrorInfo {
  componentStack: string;
}

export interface ErrorProps {
  error: Error;
  info?: ReactErrorInfo;
}

interface Props {
  children: React.ReactNode;
  render: React.ComponentType<ErrorProps>;
}

type State = {
  error?: Error;
  info?: ReactErrorInfo;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    error: undefined,
    info: undefined,
  };

  componentDidCatch(error: Error, info?: ReactErrorInfo) {
    this.setState({ error, info });
  }

  render() {
    const { children, render: Component } = this.props;
    const { error, info } = this.state;

    if (error !== undefined) {
      return <Component error={error} info={info} />;
    } else {
      return children ?? null;
    }
  }
}
