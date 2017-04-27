import React from 'react';
import Helmet from 'react-helmet';

const Miss404 = () => (
  <main className="py-5">
    <Helmet>
      <title>Page not Found</title>
    </Helmet>
    <section className="container text-center">
      <h1>404</h1>
      <h3>Page not found</h3>
    </section>
  </main>
);

export default Miss404;
