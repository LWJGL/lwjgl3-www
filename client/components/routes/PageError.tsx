import React from 'react';
import { useDocumentTitle } from '~/hooks/useDocumentTitle';
import { ErrorProps } from '../ErrorBoundary';

export function PageError({ error }: ErrorProps) {
  useDocumentTitle('An error has occured');

  return (
    <main>
      <section className="container text-center py-5">
        <h1>Something went wrong</h1>
        <h3 className="text-danger">Oh no! It appears that the page has crashed or failed to load.</h3>
      </section>
      <hr />
      <section className="container small py-5 text-muted">
        <h5>Error information</h5>
        <p>{error.message}</p>
      </section>
    </main>
  );
}
