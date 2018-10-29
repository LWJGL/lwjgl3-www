// @flow
import * as React from 'react';
import { jsx } from '@emotion/core';
import { PageView } from '~/components/routes/PageView';
import type { RouteProps } from '@reach/router';
import { Browser } from './components/Browser';
import { Global } from '@emotion/core';

const BrowseRoute = (props: RouteProps) => {
  return (
    <PageView location={props.location} title="Browse" description="Browse LWJGL files">
      <Global
        styles={[
          {
            body: {
              backgroundColor: 'gray',
            },
          },
        ]}
      />
      <section className="container px-0 bg-white shadow" style={{ marginTop: '-1em' }}>
        <Browser path={props['*']} />
      </section>
    </PageView>
  );
};

export default BrowseRoute;
