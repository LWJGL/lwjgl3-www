import React from 'react';

type ReactErrorInfo = {
  componentStack: string,
};

export type ErrorProps = {
  error: Error,
  info: ReactErrorInfo,
};

type ReactComponent = Class<React$Component<*, ErrorProps, *>>;
type ReactFunctionalComponent = (props: ErrorProps) => React$Element<*>;
type ErrorRenderer = ReactFunctionalComponent | ReactComponent;

type Props = {
  children: React$Element<*>,
  render: ErrorRenderer,
};

type State = {
  hasError: boolean,
  error?: Error,
  info?: ReactErrorInfo,
};

class ErrorBoundary extends React.Component<void, Props, State> {
  state = {
    hasError: false,
  };

  componentDidCatch(error: Error, info: ReactErrorInfo) {
    this.setState({ hasError: true, error, info });
  }

  render() {
    if (this.state.hasError) {
      const Component = this.props.render;
      const { error, info } = this.state;
      //$FlowFixMe
      return <Component error={error} info={info} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
