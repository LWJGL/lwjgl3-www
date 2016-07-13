import React from 'react'
import Helmet from 'react-helmet'
import BuildStatus from '../../components/BuildStatus'

export default class extends React.Component {

  render() {
    return (
      <main>
        <Helmet
          title="Source & Build Status"
          meta={[
            {"name": "description", "content": "Links to LWJGL Github repository and build status matrix"}
          ]}
        />

        <section className="container">
          <h1>LW<b>JGL</b> Source</h1>

          <p>LWJGL 3 is hosted on Github. Fork, star and contribute to our project!</p>
          <p><a className="btn btn-success" href="https://github.com/LWJGL/lwjgl3">Github Repository</a></p>

          <p>LWJGL's issue tracker is also hosted on Github.</p>
          <p><a className="btn btn-outline-primary" href="https://github.com/LWJGL/lwjgl3/issues">Issue Tracker</a></p>
        </section>

        <hr />

        <section className="container p-t-2">
          <h1>Build Status</h1>
          <div className="row">
            <div className="col-md-3 col-xs-12 p-y-2">
              <hr className="hidden-md-up" />
              <h2>LW<b>JGL</b> 3</h2>
              <br />
              <h4>Linux x64</h4>
              <p><a href="https://travis-ci.org/LWJGL-CI/lwjgl3/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/lwjgl3.svg?branch=master-linux64" alt="" /></a></p>
              <br />
              <h4>OS X</h4>
              <p><a href="https://travis-ci.org/LWJGL-CI/lwjgl3/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/lwjgl3.svg?branch=master-macosx" alt="" /></a></p>
              <br />
              <h4>Windows x64</h4>
              <BuildStatus name="lwjgl_Win64" />
              <br />
              <h4>Windows x86</h4>
              <BuildStatus name="lwjgl_Win32" />
            </div>
            <div className="col-md-3 col-xs-12 p-y-2">
              <hr className="hidden-md-up" />
              <h2>GLFW</h2>
              <br />
              <h4>Linux x64</h4>
              <p><a href="https://travis-ci.org/LWJGL-CI/glfw/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-linux64" alt="" /></a></p>
              <br />
              <h4>OS X</h4>
              <p><a href="https://travis-ci.org/LWJGL-CI/glfw/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-macosx" alt="" /></a></p>
              <br />
              <h4>Windows x64</h4>
              <BuildStatus name="glfw_Win64" />
              <br />
              <h4>Windows x86</h4>
              <BuildStatus name="glfw_Win32" />
            </div>
            <div className="col-md-3 col-xs-12 p-y-2">
              <hr className="hidden-md-up" />
              <h2>OpenAL Soft</h2>
              <br />
              <h4>Linux x64</h4>
              <p><a href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-linux64" alt="" /></a></p>
              <br />
              <h4>OS X</h4>
              <p><a href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-macosx" alt="" /></a></p>
              <br />
              <h4>Windows x64</h4>
              <BuildStatus name="OpenALSoft_Win64" />
              <br />
              <h4>Windows x86</h4>
              <BuildStatus name="OpenALSoft_Win32" />
            </div>

            <div className="col-md-3 col-xs-12 p-y-2">
              <hr className="hidden-md-up" />
              <h2>dyncall</h2>
              <br />
              <h4>Linux x64</h4>
              <p><a href="https://travis-ci.org/LWJGL-CI/dyncall/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-linux64" alt="" /></a></p>
              <br />
              <h4>OS X</h4>
              <p><a href="https://travis-ci.org/LWJGL-CI/dyncall/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-macosx" alt="" /></a></p>
              <br />
              <h4>Windows x64</h4>
              <BuildStatus name="dyncall_Win64" />
              <br />
              <h4>Windows x86</h4>
              <BuildStatus name="dyncall_Win32" />
            </div>
          </div>
        </section>

      </main>
    )
  }

};