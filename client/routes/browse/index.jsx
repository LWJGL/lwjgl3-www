// @flow
import * as React from 'react';
import { PageView } from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import { Head } from '~/components/Head';
import { Title } from '~/components/Title';
import { Browser } from './components/Browser';

const BrowseRoute = (props: ContextRouter) => (
  <PageView {...props}>
    <Title>Browse</Title>
    <Head tag="meta" name="description" content="Browse LWJGL files" />
    <main>
      <section className="container-fluid px-0" style={{ margin: '-1rem auto 0 auto' }}>
        <Browser />
      </section>
    </main>
  </PageView>
);

export default BrowseRoute;
