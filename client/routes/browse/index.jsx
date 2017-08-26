// @flow
import * as React from 'react';
import PageView from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import FileBrowser from './FileBrowser';

const BrowseRoute = (props: ContextRouter) => (
  <PageView {...props}>
    <Helmet>
      <title>Browse</title>
      <meta name="description" content="Browse LWJGL files" />
    </Helmet>
    <main>
      <section className="container px-0" style={{ margin: '-1rem auto' }}>
        <FileBrowser />
      </section>
    </main>
  </PageView>
);

export default BrowseRoute;
