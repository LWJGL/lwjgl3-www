import * as React from 'react';
import { PageView } from '~/components/routes/PageView';
import { RouteComponentProps, WindowLocation } from '@reach/router';
import { Provider } from '~/store/Provider';
import { BuildConfigurator } from './BuildConfigurator';

const CustomizeRoute = (props: RouteComponentProps) => (
  <PageView location={props.location as WindowLocation} title="Customize" description="Customize your LWJGL 3 build">
    <section className="container">
      <Provider>
        <BuildConfigurator />
      </Provider>
    </section>
  </PageView>
);

export default CustomizeRoute;
