import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'
import Helmet from 'react-helmet'

import * as Routes from '../routes/Routes'
import Miss404 from '../routes/miss404'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Copyright from '../components/Copyright'

if ( 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

class Layout extends React.PureComponent {

  static propTypes = {
    router: PropTypes.object.isRequired,
    action: PropTypes.oneOf(['PUSH', 'REPLACE', 'POP']).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
      hash: PropTypes.string.isRequired,
      state: PropTypes.any,
      key: PropTypes.string
    }).isRequired,
    store: PropTypes.object.isRequired
  };

  scrollPositions = {};

  componentWillUpdate(nextProps) {
    const props = this.props;
    this.scrollPositions[props.router.createHref(props.location)] = [window.pageXOffset, window.pageYOffset];

    if ( nextProps.action === 'PUSH' ) {
      window.scroll(0,0);
    }
  }

  componentDidUpdate() {
    const props = this.props;
    if ( props.action === 'POP' ) {
      const href = props.router.createHref(props.location);
      if ( this.scrollPositions[href] ) {
        window.scroll.apply(window, this.scrollPositions[href]);
      }
    }
  }

  render() {
    const props = this.props;
    const isHomepage = props.location.pathname === '/';

    return (
      <Provider store={props.store}>
        <div className={isHomepage ? null : 'menu-pad'}>
          <Helmet titleTemplate="%s - LWJGL" defaultTitle="LWJGL - Lightweight Java Game Library" />
          <Header isHome={isHomepage} />

          <Match exactly={true} pattern="/" component={Routes.Home} />
          <Match exactly={true} pattern="/download" component={Routes.Download} />
          <Match exactly={true} pattern="/guide" component={Routes.Guide} />
          <Match exactly={true} pattern="/source" component={Routes.Source} />
          <Match exactly={true} pattern="/license" component={Routes.License} />
          <Miss component={Miss404} />

          <Footer />
          <Copyright />
        </div>
      </Provider>
    );
  }

}

export default Layout
