// @flow
import * as React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

// Routes
import { Router, Location } from '@reach/router';
import { Home, Guide, Download, Customize, Browse, Source, License } from '../routes';
import { Miss404 } from '../routes/miss404';

export const Layout = () => {
  return (
    <React.Fragment>
      <Location>{({ location }) => <Header isHome={location.pathname === '/'} />}</Location>
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
      <Location>
        {({ location }) =>
          location.pathname !== '/customize' && !location.pathname.startsWith('/browse') ? <Footer /> : null
        }
      </Location>
    </React.Fragment>
  );
};
