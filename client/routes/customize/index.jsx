// @flow
import * as React from 'react';
import { PageView } from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import { Head } from '~/components/Head';
import { Title } from '~/components/Title';
import { Provider } from '~/store/Provider';
import { BuildConfigurator } from './BuildConfigurator';

const CustomizeRoute = (props: ContextRouter) => (
  <PageView {...props}>
    <Title>Customize</Title>
    <Head tag="meta" name="description" content="Customize your LWJGL 3 build" />
    <main>
      <section className="container">
        <Provider>
          <BuildConfigurator />
        </Provider>
      </section>
    </main>
  </PageView>
);

export default CustomizeRoute;
