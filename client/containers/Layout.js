import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import Header from './Header';
import Footer from './Footer';

// Routes
import { Home, Download, Guide, Source, License } from '../routes';
import Miss404 from '../routes/miss404';

const Layout = () => (
  <div>
    <Helmet titleTemplate="%s - LWJGL" defaultTitle="LWJGL - Lightweight Java Game Library" />
    <Header />

    <Switch>
      <Route path="/" component={Home} exact={true} />
      <Route path="/download" component={Download} exact={true} />
      <Route path="/guide" component={Guide} exact={true} />
      <Route path="/source" component={Source} exact={true} />
      <Route path="/license" component={License} exact={true} />
      <Route component={Miss404} />
    </Switch>

    <Footer />
  </div>
);

export default Layout;
