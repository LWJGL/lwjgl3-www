// @flow
import * as React from 'react';
import { PageView } from '~/components/routes/PageView';
import type { RouteProps } from '@reach/router';
import { Head } from '~/components/Head';
import { Title } from '~/components/Title';
import { Provider } from '~/store/Provider';
import { BuildConfigurator } from './BuildConfigurator';
import { useDocumentTitle } from '~/hooks/useDocumentTitle';

const CustomizeRoute = (props: RouteProps) => (
  <PageView location={props.location} title="Customize">
    <Head>
      <meta name="description" content="Customize your LWJGL 3 build" />
    </Head>
    <section className="container">
      <Provider>
        <BuildConfigurator />
      </Provider>
    </section>
  </PageView>
);

export default CustomizeRoute;
