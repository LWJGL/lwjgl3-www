import React, { useEffect } from 'react';
import { PageView } from '~/components/routes/PageView';
import { RouteComponentProps, WindowLocation } from '@reach/router';
import { Browser } from './components/Browser';
import { PathResource } from './PathResource';

interface BrowseRouteProps {
  '*': string;
}

const BrowseRoute = (props: RouteComponentProps<BrowseRouteProps>) => {
  const path = props['*'] !== undefined ? props['*'] : '';

  useEffect(() => {
    PathResource.load(path);
  }, [path]);

  return (
    <PageView location={props.location as WindowLocation} title="Browse" description="Browse LWJGL files">
      <style
        dangerouslySetInnerHTML={{
          __html: `body { background: gray }`,
        }}
      />
      <section className="container px-0 bg-white shadow" style={{ marginTop: '-1em' }}>
        <Browser path={path} />
      </section>
    </PageView>
  );
};

export default BrowseRoute;
