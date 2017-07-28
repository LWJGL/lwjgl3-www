import React from 'react';
import PageView from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import Style from '~/components/Style';

import BuildContainer from './BuildConfigurator';
import FileBrowser from './FileBrowser';
import FaGithub from 'react-icons/fa/github';

const DownloadRoute = (props: ContextRouter) =>
  <PageView {...props}>
    <Style loader={require('./styles.scss')} />
    <Helmet>
      <title>Download</title>
      <meta name="description" content="Download release, stable, or nightly builds of LWJGL 3" />
    </Helmet>
    <main>
      <section className="container pb-4">
        <h1>
          Download LW<b>JGL</b> 3
        </h1>
        <p>All official releases are available for download from GitHub.</p>
        <p>
          <a
            className="btn btn-xs-block btn-lg btn-primary"
            href="https://github.com/LWJGL/lwjgl3/releases"
            target="_blank"
          >
            <FaGithub /> Download from Github
          </a>
        </p>
        <p>
          To customize your LWJGL build or use the latest stable & nightly releases, use the download configurator
          below.
          <br />
          For more information and IDE setup, see the{' '}
          <a href="https://github.com/LWJGL/lwjgl3-wiki/wiki/1.2.-Install">installation instructions</a>
          .
        </p>
        <BuildContainer />

        <p>Or browse and download files directly:</p>
        <div style={{ backgroundColor: 'lightyellow', padding: 20 }}>
          <FileBrowser />
        </div>
      </section>

      <div className="area-dark py-4">
        <section className="container">
          <h3>Build from source?</h3>
          <p>Click below if you prefer to build from source:</p>
          <p>
            <Link className="btn btn-xs-block btn-outline-info" to="/source">
              Source
            </Link>
            <Link className="btn btn-xs-block btn-outline-info" to="/guide#build-instructions">
              Build instructions
            </Link>
          </p>
        </section>
      </div>

      <section className="container pt-4">
        <p>
          Broken download? Let us know at the <a href="http://forum.lwjgl.org/">forums</a>.
        </p>

        <h2>Looking for LWJGL 2?</h2>

        <p>LWJGL 2 has moved but is still available. Please follow the links below to find what you're looking for:</p>
        <p>
          <a className="btn btn-xs-block btn-outline-primary" href="http://legacy.lwjgl.org/">
            LWJGL 2 WEBSITE
          </a>
          <a className="btn btn-xs-block btn-outline-primary" href="http://wiki.lwjgl.org/">
            LWJGL 2 WIKI
          </a>
        </p>
      </section>
    </main>
  </PageView>;

export default DownloadRoute;
