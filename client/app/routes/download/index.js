import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router/es6'

export default class extends React.Component {

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
        <section className="container">
          <h1>Download LW<b>JGL</b> 3</h1>
          <div className="row">
            <div className="col-md-4 col-xs-12 p-y-1">
              <h3>Release</h3>
              <p>Latest official release.</p>
              <p><a className="btn btn-success" href="http://build.lwjgl.org/release/latest/lwjgl.zip"><i className="fa fa-cloud-download" /> DOWNLOAD RELEASE</a></p>
              <iframe className="build-status" src="teamcity?id=LwjglReleases_StableToRelease"></iframe>

              <p className="m-t-2">
                <i className="fa fa-clock-o" /> <a href="https://github.com/LWJGL/lwjgl3/commits/master">ChangeLog</a>
                <br /><i className="fa fa-file-text-o" /> <a href="https://github.com/LWJGL/lwjgl3/blob/master/doc/notes/latest.md">Release notes</a>
              </p>
            </div>
            <div className="col-md-4 col-xs-12 p-y-1">
              <h3>Stable (newer)</h3>
              <p>Latest build that has been verified to work.</p>
              <p><a className="btn btn-warning" href="http://build.lwjgl.org/stable/lwjgl.zip"><i className="fa fa-cloud-download" /> DOWNLOAD STABLE</a></p>
              <iframe className="build-status" src="teamcity?id=LwjglReleases_NightlyToStable"></iframe>
            </div>
            <div className="col-md-4 col-xs-12 p-y-1">
              <h3>Nightly (newest)</h3>
              <p>Bleeding edge, possibly broken.</p>
              <p><a className="btn btn-danger" href="http://build.lwjgl.org/nightly/lwjgl.zip"><i className="fa fa-cloud-download" /> DOWNLOAD NIGHTLY</a></p>
              <iframe className="build-status" src="teamcity?id=lwjgl_Bundle"></iframe>
            </div>
          </div>
        </section>

        <div className="area-dark p-y-2">
            <section className="container m-b-2">
              <p>Broken download? Let us know at the <a href="http://forum.lwjgl.org/">forums</a>.</p>
            </section>

            <section className="container">
              <h3>Build from source?</h3>
              <p>Click below if you prefer to build from source:</p>
              <p>
                <Link className="btn btn-info" to="/source"><i className="fa fa-code" /> Source</Link>
                &nbsp;
                <Link className="btn btn-info" to="/guide"><i className="fa fa-info-circle" /> Build instructions</Link>
              </p>
            </section>
        </div>


        <section className="container p-t-2">
          <h2>Looking for LWJGL 2?</h2>

          <p>LWJGL 2 has moved but is still available. Please follow the links below to find what you're looking for:</p>
          <p>
            <a className="btn btn-outline-primary" href="http://legacy.lwjgl.org/">LWJGL 2 WEBSITE</a>
            &nbsp;
            <a className="btn btn-outline-primary" href="http://wiki.lwjgl.org/">LWJGL 2 WIKI</a>
          </p>
        </section>
      </main>
    )
  }

};