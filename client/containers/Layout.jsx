// @flow
import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

// Routes
import { Home, Guide, Download, Customize, Browse, Source, License } from '../routes';
import { Miss404 } from '../routes/miss404';

export const Layout = () => {
  return (
    <React.Fragment>
      <Route render={({ location: { pathname } }) => <Header pathname={pathname} />} />

      <Switch>
        <Route path="/" exact={true} strict={true} component={Home} />
        <Route path="/guide" sensitive={true} exact={true} strict={true} component={Guide} />
        <Route path="/download" sensitive={true} exact={true} strict={true} component={Download} />
        <Route path="/customize" sensitive={true} exact={true} strict={true} component={Customize} />
        <Route path="/browse" sensitive={true} exact={true} strict={true} component={Browse} />
        <Route path="/source" sensitive={true} exact={true} strict={true} component={Source} />
        <Route path="/license" sensitive={true} exact={true} strict={true} component={License} />
        <Route component={Miss404} />
      </Switch>

      <Route
        render={props =>
          props.location.pathname !== '/customize' && props.location.pathname !== '/browse' ? <Footer /> : null
        }
      />
    </React.Fragment>
  );
};
