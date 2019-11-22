import React, { Suspense } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PageError } from '../components/routes/PageError';
import { PageBlank } from '../components/routes/PageBlank';

// Routes
import { Router } from '@reach/router';
import { Home, Guide, Download, Customize, Browse, Source, License } from '../routes';
import { Miss404 } from '../routes/miss404';

export const Layout: React.FC<{ children?: never }> = () => (
  <>
    <Router primary={false} component={React.Fragment}>
      <Header path="/*" />
    </Router>
    <ErrorBoundary fallback={PageError}>
      <Suspense fallback={<PageBlank />} unstable_avoidThisFallback={true}>
        <Router component="main">
          <Home path="/" />
          <Guide path="/guide" />
          <Download path="/download" />
          <Customize path="/customize" />
          <Browse path="/browse/*" />
          <Source path="/source" />
          <License path="/license" />
          <Miss404 default />
        </Router>
      </Suspense>
    </ErrorBoundary>
    <Router primary={false} component={React.Fragment}>
      <Footer path="/*" />
    </Router>
  </>
);
