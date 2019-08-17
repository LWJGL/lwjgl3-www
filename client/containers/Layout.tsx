import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
// import { NavProgress } from '~/components/NavProgress';

// Routes
import { Router } from '@reach/router';
import { Home, Guide, Download, Customize, Browse, Source, License } from '../routes';
import { Miss404 } from '../routes/miss404';

export function Layout() {
  return (
    <React.Fragment>
      {/* <NavProgress /> */}
      <Router primary={false}>
        <Header path="/*" />
      </Router>
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
      <Router primary={false}>
        <Footer path="/*" />
      </Router>
    </React.Fragment>
  );
}
