import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import {Match, Miss} from 'react-router'
import Helmet from 'react-helmet'

import * as Routes from '../routes/Routes'
import Miss404 from '../routes/miss404'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Copyright from '../components/Copyright'

const Layout = props => {

  const isHomepage = props.location.pathname === '/';

  return (
    <Provider store={props.store}>
      <div className={!isHomepage ? 'menu-pad' : null}>
        <Helmet titleTemplate="%s - LWJGL" defaultTitle="LWJGL - Lightweight Java Game Library" />
        <Header isHome={isHomepage} />

        <div id="lwjgl-routes">
          <Match exactly={true} pattern="/" component={Routes.Home} />
          <Match exactly={true} pattern="/download" component={Routes.Download} />
          <Match exactly={true} pattern="/guide" component={Routes.Guide} />
          <Match exactly={true} pattern="/source" component={Routes.Source} />
          <Match exactly={true} pattern="/license" component={Routes.License} />
          <Miss component={Miss404} />
        </div>

        <Footer />
        <Copyright />
      </div>
    </Provider>
  )
};

Layout.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  store: PropTypes.object.isRequired
};

export default Layout
