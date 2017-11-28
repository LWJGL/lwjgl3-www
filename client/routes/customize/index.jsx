// @flow
import * as React from 'react';
import { PageView } from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { BuildConfigurator } from './BuildConfigurator';
import { store } from '~/store';

const CustomizeRoute = (props: ContextRouter) => (
  <PageView {...props}>
    <Helmet>
      <title>Customize</title>
      <meta name="description" content="Customize your LWJGL 3 build" />
    </Helmet>
    <main>
      <section className="container">
        <BuildConfigurator />
      </section>
    </main>
  </PageView>
);

export default CustomizeRoute;
