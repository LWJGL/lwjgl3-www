// @flow
import * as React from 'react';
import PageView from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import IconGithub from 'react-icons/fa/github';
import IconCustomize from 'react-icons/fa/check-square-o';
import IconFolder from 'react-icons/md/folder';

import { Customize, Browse } from '../';

const DownloadRoute = (props: ContextRouter) => (
  <PageView {...props}>
    <Helmet>
      <title>Download</title>
      <meta name="description" content="Download LWJGL 3" />
    </Helmet>
    <main>
      <section className="container pb-4">
        <h1>
          Download LW<b>JGL</b> 3
        </h1>
        <hr />
        <div className="row">
          <div className="col-md-12 col-lg-4">
            <p>All official releases are available for download from GitHub:</p>
            <p>
              <a
                className="btn btn-xs-block btn-lg btn-dark"
                href="https://github.com/LWJGL/lwjgl3/releases"
                target="_blank"
                rel="noopener"
              >
                <IconGithub /> Download from Github
              </a>
            </p>
          </div>
          <div
            className="col-md-12 col-lg-4"
            onMouseOver={() =>
              // $FlowFixMe
              Customize.preload()
            }
          >
            <p>You can customize your LWJGL build or use the latest stable & nightly releases:</p>
            <p>
              <Link className="btn btn-xs-block btn-lg btn-dark" to="/customize">
                <IconCustomize /> Customize LWJGL 3
              </Link>
            </p>
          </div>
          <div
            className="col-md-12 col-lg-4"
            onMouseOver={() =>
              // $FlowFixMe
              Browse.preload()
            }
          >
            <p>Or you can browse and download individual LWJGL artifacts:</p>
            <p>
              <Link className="btn btn-xs-block btn-lg btn-outline-dark" to="/browse">
                <IconFolder /> Browse LWJGL files
              </Link>
            </p>
          </div>
        </div>
      </section>

      <div className="area-dark py-5">
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

      <section className="container py-4">
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
  </PageView>
);

export default DownloadRoute;
