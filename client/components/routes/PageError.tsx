import { useDocumentTitle } from '~/hooks/useDocumentTitle';
import { COLOR_RED } from '~/theme';
import type { ErrorProps } from '../ErrorBoundary';

export function PageError({ error }: ErrorProps) {
  useDocumentTitle('An error has occured');

  return (
    <div style={{ backgroundColor: COLOR_RED.css(), color: '#fff', marginTop: '-1rem', paddingTop: '1rem' }}>
      <section className="container text-center pt-5 pb-3">
        <h1>Something went wrong</h1>
        <h3>Oh no! It appears that the page has crashed or failed to load.</h3>
      </section>
      <hr />
      <section className="container pt-3 pb-5 text-light" style={{ marginBottom: '-1rem' }}>
        <h5>Error information</h5>
        <p className="text-warning">{error.message}</p>
      </section>
    </div>
  );
}
