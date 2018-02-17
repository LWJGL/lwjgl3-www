// @flow
import * as React from 'react';
import { PageView } from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import { BuildConfigurator } from './BuildConfigurator';
import { Head } from '~/components/Head';
import { Title } from '~/components/Title';
import { store } from '~/store';

const CustomizeRoute = (props: ContextRouter) => (
  <PageView {...props}>
    <Title>Customize</Title>
    <Head tag="meta" name="description" content="Customize your LWJGL 3 build" />
    <main>
      <section className="container">
        <BuildConfigurator />
      </section>
    </main>
  </PageView>
);

// import { hot } from 'react-hot-loader';
// export default hot(module)(CustomizeRoute);
export default CustomizeRoute;
