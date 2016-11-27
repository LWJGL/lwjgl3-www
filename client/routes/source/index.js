import React from 'react'
import Helmet from 'react-helmet'
import TeamcityStatus from '../../components/TeamcityStatus'

const SourceRoute = () => (
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
      <p>
        <a className="btn btn-xs-block btn-success" href="https://github.com/LWJGL/lwjgl3">Github Repository</a>
        <a className="btn btn-xs-block btn-outline-primary" href="https://github.com/LWJGL/lwjgl3/blob/master/doc/notes/latest.md">Release notes</a>
        <a className="btn btn-xs-block btn-outline-primary" href="https://github.com/LWJGL/lwjgl3/commits/master">Changelog</a>
      </p>

      <p>
        LWJGL's issue tracker is also hosted on Github.
      </p>
      <p>
        <a className="btn btn-xs-block btn-outline-primary" href="https://github.com/LWJGL/lwjgl3/issues">Issue Tracker</a>
      </p>
    </section>

    <hr/>

    <section className="container pt-2">
      <h1 className="pb-2">Build Status</h1>
      <div className="row">
        <div className="col-lg-4 col-xs-12">
          <h2>LWJGL</h2>
          <table className="table table-bordered table-inverse">
          <tbody>
          <tr>
            <th>Linux x64</th>
            <td><a href="https://travis-ci.org/LWJGL-CI/lwjgl3/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/lwjgl3.svg?branch=master-linux64" alt="" /></a></td>
          </tr>
          <tr>
            <th>macOS</th>
            <td><a href="https://travis-ci.org/LWJGL-CI/lwjgl3/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/lwjgl3.svg?branch=master-macosx" alt="" /></a></td>
          </tr>
          <tr>
            <th>Windows x64</th>
            <td><TeamcityStatus name="lwjgl_Win64" /></td>
          </tr>
            <tr>
              <th>Windows x86</th>
              <td><TeamcityStatus name="lwjgl_Win32" /></td>
            </tr>
          </tbody>
          </table>
        </div>

        <div className="col-lg-4 col-xs-12">
          <h2>bgfx</h2>
          <table className="table table-bordered table-inverse">
            <tbody>
            <tr>
              <th>Linux x64</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/bgfx/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/bgfx.svg?branch=master-linux" alt="" /></a></td>
            </tr>
            <tr>
              <th>macOS</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/bgfx/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/bgfx.svg?branch=master-macos" alt="" /></a></td>
            </tr>
            <tr>
              <th>Windows x64</th>
              <td><TeamcityStatus name="Bgfx_Win64" /></td>
            </tr>
              <tr>
                <th>Windows x86</th>
                <td><TeamcityStatus name="Bgfx_Win32" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-lg-4 col-xs-12">
          <h2>dyncall</h2>
          <table className="table table-bordered table-inverse">
            <tbody>
            <tr>
              <th>Linux x64</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/dyncall/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-linux64" alt="" /></a></td>
            </tr>
            <tr>
              <th>macOS</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/dyncall/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-macosx" alt="" /></a></td>
            </tr>
            <tr>
              <th>Windows x64</th>
              <td><TeamcityStatus name="dyncall_Win64" /></td>
            </tr>
              <tr>
                <th>Windows x86</th>
                <td><TeamcityStatus name="dyncall_Win32" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-lg-4 col-xs-12">
          <h2>GLFW</h2>
          <table className="table table-bordered table-inverse">
            <tbody>
            <tr>
              <th>Linux x64</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/glfw/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-linux64" alt="" /></a></td>
            </tr>
            <tr>
              <th>macOS</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/glfw/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-macosx" alt="" /></a></td>
            </tr>
            <tr>
              <th>Windows x64</th>
              <td><TeamcityStatus name="glfw_Win64" /></td>
            </tr>
              <tr>
                <th>Windows x86</th>
                <td><TeamcityStatus name="glfw_Win32" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-lg-4 col-xs-12">
          <h2>jemalloc</h2>
          <table className="table table-bordered table-inverse">
            <tbody>
            <tr>
              <th>Linux x64</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/jemalloc/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/jemalloc.svg?branch=master-linux64" alt="" /></a></td>
            </tr>
            <tr>
              <th>macOS</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/jemalloc/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/jemalloc.svg?branch=master-macosx" alt="" /></a></td>
            </tr>
            <tr>
              <th>Windows x64</th>
              <td><TeamcityStatus name="Jemalloc_Win64" /></td>
            </tr>
              <tr>
                <th>Windows x86</th>
                <td><TeamcityStatus name="Jemalloc_Win32" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-lg-4 col-xs-12">
          <h2>OpenAL Soft</h2>
          <table className="table table-bordered table-inverse">
            <tbody>
            <tr>
              <th>Linux x64</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-linux64" alt="" /></a></td>
            </tr>
            <tr>
              <th>macOS</th>
              <td><a href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"><img width={90} height={20} src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-macosx" alt="" /></a></td>
            </tr>
            <tr>
              <th>Windows x64</th>
              <td><TeamcityStatus name="OpenALSoft_Win64" /></td>
            </tr>
              <tr>
                <th>Windows x86</th>
                <td><TeamcityStatus name="OpenALSoft_Win32" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </main>
);

export default SourceRoute
