// @flow
import * as React from 'react';
import { Title } from '../../components/Title';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export const Miss404 = () => {
  useDocumentTitle('Page not Found');
  return (
    <section className="container text-center py-5">
      <h1>404</h1>
      <h3>Page not found</h3>
    </section>
  );
};
