// @flow
import * as React from 'react';
import { Title } from '../Title';
import type { ErrorProps } from '../ErrorBoundary';

export class PageError extends React.Component<ErrorProps> {
  render() {
    return (
      <main>
        <Title>An error has occured</Title>
        <section className="container text-center py-5">
          <h1>Something went wrong</h1>
          <h3 className="text-danger">Oh no! It appears that the page has crashed or failed to load.</h3>
        </section>
        <hr />
        <section className="container small py-5 text-muted">
          <h5>Error information</h5>
          <p>{this.props.error.message}</p>
          <pre className="text-muted">
            <code>{JSON.stringify(this.props.info, null, 2).replace(/\\n/g, '\n')}</code>
          </pre>
        </section>
      </main>
    );
  }
}
