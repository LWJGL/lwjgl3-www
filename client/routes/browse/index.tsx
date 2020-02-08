import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageView } from '~/components/routes/PageView';
import { Browser } from './components/Browser';
import { PathResource } from './PathResource';

const BrowseRoute: React.FC<{ children?: never }> = () => {
  const params = useParams();
  const path = params['*'] !== undefined ? params['*'] : '';

  useEffect(() => {
    PathResource.load(path);
  }, [path]);

  useEffect(() => {
    document.body.style.background = 'gray';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  return (
    <PageView title="Browse" description="Browse LWJGL files">
      <section className="container px-0 bg-white shadow" style={{ marginTop: '-1em' }}>
        <Browser path={path} />
      </section>
    </PageView>
  );
};

export default BrowseRoute;
