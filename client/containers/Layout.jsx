// @flow
import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import Header from './Header';
import Footer from './Footer';

// Routes
import { Home, Guide, Download, Customize, Browse, Source, License } from '../routes';
import Miss404 from '../routes/miss404';

const Layout = () => [
  <Helmet key="helmet" titleTemplate="%s - LWJGL" defaultTitle="LWJGL - Lightweight Java Game Library" />,
  <Header key="header" />,

  <Switch key="router">
    <Route path="/" component={Home} exact={true} />
    <Route path="/guide" component={Guide} exact={true} />
    <Route path="/download" component={Download} exact={true} />
    <Route path="/customize" component={Customize} exact={true} />
    <Route path="/browse" component={Browse} exact={true} />
    <Route path="/source" component={Source} exact={true} />
    <Route path="/license" component={License} exact={true} />
    <Route component={Miss404} />
  </Switch>,

  <Route
    key="footer"
    render={props =>
      props.location.pathname !== '/customize' && props.location.pathname !== '/browse' ? <Footer /> : null}
  />,
];

export default Layout;
