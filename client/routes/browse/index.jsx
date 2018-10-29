// @flow
import * as React from 'react';
import { jsx } from '@emotion/core';
import { PageView } from '~/components/routes/PageView';
import type { RouteProps } from '@reach/router';
import { Head } from '~/components/Head';
import { Title } from '~/components/Title';
import { Browser } from './components/Browser';
import { Global } from '@emotion/core';

const BrowseRoute = (props: RouteProps) => {
  return (
    <PageView location={props.location} title="Browse">
      <Global
        styles={[
          {
            body: {
              backgroundColor: 'gray',
            },
          },
        ]}
      />
      <Head>
        <meta name="description" content="Browse LWJGL files" />
      </Head>
      <section className="container px-0 bg-white shadow" style={{ marginTop: '-1em' }}>
        <Browser path={props['*']} />
      </section>
    </PageView>
  );
};

export default BrowseRoute;
