import React from 'react'
import Helmet from 'react-helmet'
import Header from './Header'
import Footer from './Footer'
import Copyright from './Copyright'

export default class App extends React.PureComponent {

  render() {
    const isHomepage = this.props.location.pathname === '/';

    return (
      <div className={!isHomepage ? 'menu-pad' : null}>
        <Helmet titleTemplate="%s - LWJGL" defaultTitle="LWJGL - Lightweight Java Game Library" />
        <Header isHome={isHomepage} />
        {this.props.children}
        <hr />
        <Footer />
        <Copyright />
      </div>
    )
  }

}