import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router'

import BuildContainer from '../../containers/build'
import reducer from '../../containers/build/reducer'
import injectReducer from '../../store/injectReducer'
import ejectReducer from '../../store/ejectReducer'

class DownloadRoute extends React.PureComponent {

  static contextTypes = {
    store: React.PropTypes.object
  };

  componentWillMount() {
    injectReducer(this.context.store, 'build', reducer);

    if ( process.env.NODE_ENV !== 'production' ) {
      if ( !DownloadRoute._init ) {
        DownloadRoute._init = true;

        if ( module.hot ) {
          module.hot.accept('../../containers/build/reducer', () => {
            injectReducer(this.context.store, 'build', reducer);
          })
        }
      }
    }
  }

  componentWillUnmount() {
    ejectReducer(this.context.store, 'build');
  }

  render() {
    return (
      <main>
        <Helmet
          title="Download"
          meta={[
            {
              "name": "description",
              "content": "Download release, stable, or nightly builds of LWJGL 3"
            }
          ]}
        />
        <section className="container p-b-2">
          <h1>Download LW<b>JGL</b> 3</h1>

          <p>Select a build to begin configuring your download:</p>
          <BuildContainer />
        </section>

        <div className="area-dark p-y-2">
          <section className="container">
            <h3>Build from source?</h3>
            <p>Click below if you prefer to build from source:</p>
            <p>
              <Link className="btn btn-xs-block btn-outline-info" to="/source">Source</Link>
              <a className="btn btn-xs-block btn-outline-info" href="/guide#build-instructions">Build instructions</a>
            </p>
          </section>
        </div>

        <section className="container p-t-2">
          <p>Broken download? Let us know at the <a href="http://forum.lwjgl.org/">forums</a>.</p>

          <h2>Looking for LWJGL 2?</h2>

          <p>LWJGL 2 has moved but is still available. Please follow the links below to find what you're looking
            for:</p>
          <p>
            <a className="btn btn-xs-block btn-outline-primary" href="http://legacy.lwjgl.org/">LWJGL 2 WEBSITE</a>
            <a className="btn btn-xs-block btn-outline-primary" href="http://wiki.lwjgl.org/">LWJGL 2 WIKI</a>
          </p>
        </section>
      </main>
    );
  }

}

export default DownloadRoute
