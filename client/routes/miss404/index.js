import React from 'react'
import Helmet from 'react-helmet'

const Miss404 = () => (
  <main className="p-y-2">
    <Helmet title="Page not Found" />
    <section className="container text-xs-center">
      <h1>404</h1>
      <h3>Page not found</h3>
    </section>
  </main>
);

export default Miss404;