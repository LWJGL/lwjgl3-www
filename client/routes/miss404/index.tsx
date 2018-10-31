import * as React from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

interface Props {
  default: boolean;
}

export function Miss404(props: Props) {
  useDocumentTitle('Page not Found');
  return (
    <section className="container text-center py-5">
      <h1>404</h1>
      <h3>Page not found</h3>
    </section>
  );
}
