import React from 'react';
import { PageView } from '~/components/routes/PageView';
import { RouteComponentProps, WindowLocation } from '@reach/router';
import { Browser } from './components/Browser';
import { Global } from '@emotion/core';

interface BrowseRouteProps extends RouteComponentProps {
  location: WindowLocation;
  '*': string;
}

const BrowseRoute = (props: BrowseRouteProps) => {
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
