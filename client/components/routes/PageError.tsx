import React from 'react';
import { useDocumentTitle } from '~/hooks/useDocumentTitle';
import { ErrorProps } from '../ErrorBoundary';
import { COLOR_RED } from '~/theme';

export function PageError({ error }: ErrorProps) {
  useDocumentTitle('An error has occured');

  return (
    <main style={{ backgroundColor: COLOR_RED.css(), color: '#fff' }}>
      <section className="container text-center pt-5 pb-3">
        <h1>Something went wrong</h1>
        <h3>Oh no! It appears that the page has crashed or failed to load.</h3>
      </section>
      <hr />
      <section className="container pt-3 pb-5 text-light" style={{ marginBottom: '-1rem' }}>
        <h5>Error information</h5>
        <p>{error.message}</p>
        <pre className="text-warning">{error.stack}</pre>
      </section>
    </main>
  );
}
