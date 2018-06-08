// @flow
import * as React from 'react';
import { PageView } from '~/containers/PageView';
import type { RouteProps } from '@reach/router';
import { Head } from '~/components/Head';
import { Title } from '~/components/Title';
import { Browser } from './components/Browser';

const BrowseRoute = (props: RouteProps) => (
  <PageView location={props.location}>
    <Title>Browse</Title>
    <Head tag="meta" name="description" content="Browse LWJGL files" />
    <section className="container-fluid px-0" style={{ margin: '-1rem auto 0 auto' }}>
      <Browser />
    </section>
  </PageView>
);

export default BrowseRoute;
