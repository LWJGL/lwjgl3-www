import React from 'react'
import {Match, Miss} from 'react-router'
import Helmet from 'react-helmet'
import Header from './Header'
import Footer from './Footer'
import Copyright from './Copyright'
// import DevTools from 'mobx-react-devtools'

import * as Routes from '../routes/Routes'
import Miss404 from '../routes/miss404'

const Layout = props => {

  const isHomepage = props.location.pathname === '/';

  return (
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
      {/*<DevTools position={{bottom: 0, right: 20}} highlightTimeout={1000} />*/}
    </div>
  )
};

Layout.propTypes = {
  location: React.PropTypes.object.isRequired
};

export default Layout