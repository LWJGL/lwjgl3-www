// @flow
import * as React from 'react';
import { Title } from '~/components/Title';
import type { ErrorProps } from './ErrorBoundary';

export class PageError extends React.Component<ErrorProps> {
  render() {
    return (
      <main>
        <Title>An error has occured</Title>
        <section className="container text-center py-5">
          <h1>Something went wrong</h1>
          <h3 className="text-danger">Oh no! It appears that the page has crashed.</h3>
        </section>
      </main>
    );
  }
}
