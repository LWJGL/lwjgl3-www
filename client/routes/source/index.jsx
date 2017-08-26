// @flow
import * as React from 'react';
import PageView from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import FaGithub from 'react-icons/fa/github';
import BuildBadge from './BuildBadge';

const SourceRoute = (props: ContextRouter) => (
  <PageView {...props}>
    <Helmet>
      <title>Source & Build Status</title>
      <meta name="description" content="Links to LWJGL Github repository and build status matrix" />
    </Helmet>
    <main>
      <section className="container pb-5">
        <h1>
          LW<b>JGL</b> Source
        </h1>

        <p>LWJGL 3 is hosted on Github. Fork, star and contribute to our project!</p>
        <p>
          <a className="btn btn-xs-block btn-success" href="https://github.com/LWJGL/lwjgl3">
            <FaGithub /> Github Repository
          </a>
          <a className="btn btn-xs-block btn-outline-primary" href="https://github.com/LWJGL/lwjgl3/releases">
            Release notes
          </a>
          <a className="btn btn-xs-block btn-outline-primary" href="https://github.com/LWJGL/lwjgl3/commits/master">
            Changelog
          </a>
        </p>

        <p>LWJGL's issue tracker is also hosted on Github.</p>
        <a className="btn btn-xs-block btn-outline-primary" href="https://github.com/LWJGL/lwjgl3/issues">
          Issue Tracker
        </a>
      </section>

      <hr />

      <section className="container pt-4">
        <h1 className="pb-4">Build Status</h1>
        <div className="row">
          <div className="col-lg-4">
            <h2>LWJGL</h2>
            <table className="table table-bordered table-inverse">
              <tbody>
                <BuildBadge
                  title="Linux x64"
                  href="https://travis-ci.org/LWJGL-CI/lwjgl3/branches"
                  src="https://travis-ci.org/LWJGL-CI/lwjgl3.svg?branch=master-linux64"
                />
                <BuildBadge
                  title="macOS"
                  href="https://travis-ci.org/LWJGL-CI/lwjgl3/branches"
                  src="https://travis-ci.org/LWJGL-CI/lwjgl3.svg?branch=master-macosx"
                />
                <BuildBadge
                  title="Windows x64"
                  href="https://ci.appveyor.com/project/LWJGL-CI/lwjgl3"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/lwjgl3/branch/master-linux64/1"
                />
                <BuildBadge
                  title="Windows x86"
                  href="https://ci.appveyor.com/project/LWJGL-CI/lwjgl3"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/lwjgl3/branch/master-linux64/2"
                />
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <h2>Assimp</h2>
            <table className="table table-bordered table-inverse">
              <tbody>
                <BuildBadge
                  title="Linux x64"
                  href="https://travis-ci.org/LWJGL-CI/assimp/branches"
                  src="https://travis-ci.org/LWJGL-CI/assimp.svg?branch=master"
                />
                <BuildBadge
                  title="macOS"
                  href="https://travis-ci.org/LWJGL-CI/assimp/branches"
                  src="https://travis-ci.org/LWJGL-CI/assimp.svg?branch=master-macos"
                />
                <BuildBadge
                  title="Windows x64"
                  href="https://ci.appveyor.com/project/LWJGL-CI/assimp"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/assimp/branch/master/1"
                />
                <BuildBadge
                  title="Windows x86"
                  href="https://ci.appveyor.com/project/LWJGL-CI/assimp"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/assimp/branch/master/2"
                />
              </tbody>
            </table>
          </div>

          <div className="col-lg-4">
            <h2>bgfx</h2>
            <table className="table table-bordered table-inverse">
              <tbody>
                <BuildBadge
                  title="Linux x64"
                  href="https://travis-ci.org/LWJGL-CI/bgfx/branches"
                  src="https://travis-ci.org/LWJGL-CI/bgfx.svg?branch=master-linux"
                />
                <BuildBadge
                  title="macOS"
                  href="https://travis-ci.org/LWJGL-CI/bgfx/branches"
                  src="https://travis-ci.org/LWJGL-CI/bgfx.svg?branch=master-macos"
                />
                <BuildBadge
                  title="Windows x64"
                  href="https://ci.appveyor.com/project/LWJGL-CI/bgfx"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/bgfx/branch/master-linux/1"
                />
                <BuildBadge
                  title="Windows x86"
                  href="https://ci.appveyor.com/project/LWJGL-CI/bgfx"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/bgfx/branch/master-linux/2"
                />
              </tbody>
            </table>
          </div>

          <div className="col-lg-4">
            <h2>dyncall</h2>
            <table className="table table-bordered table-inverse">
              <tbody>
                <BuildBadge
                  title="Linux x64"
                  href="https://travis-ci.org/LWJGL-CI/dyncall/branches"
                  src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-linux64"
                />
                <BuildBadge
                  title="macOS"
                  href="https://travis-ci.org/LWJGL-CI/dyncall/branches"
                  src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-macosx"
                />
                <BuildBadge
                  title="Windows x64"
                  href="https://ci.appveyor.com/project/LWJGL-CI/dyncall"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/dyncall/branch/master-linux64/1"
                />
                <BuildBadge
                  title="Windows x86"
                  href="https://ci.appveyor.com/project/LWJGL-CI/dyncall"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/dyncall/branch/master-linux64/2"
                />
              </tbody>
            </table>
          </div>

          <div className="col-lg-4">
            <h2>GLFW</h2>
            <table className="table table-bordered table-inverse">
              <tbody>
                <BuildBadge
                  title="Linux x64"
                  href="https://travis-ci.org/LWJGL-CI/glfw/branches"
                  src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-linux64"
                />
                <BuildBadge
                  title="macOS"
                  href="https://travis-ci.org/LWJGL-CI/glfw/branches"
                  src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-macosx"
                />
                <BuildBadge
                  title="Windows x64"
                  href="https://ci.appveyor.com/project/LWJGL-CI/glfw"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/glfw/branch/master-linux64/1"
                />
                <BuildBadge
                  title="Windows x86"
                  href="https://ci.appveyor.com/project/LWJGL-CI/glfw"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/glfw/branch/master-linux64/2"
                />
              </tbody>
            </table>
          </div>

          <div className="col-lg-4">
            <h2>jemalloc</h2>
            <table className="table table-bordered table-inverse">
              <tbody>
                <BuildBadge
                  title="Linux x64"
                  href="https://travis-ci.org/LWJGL-CI/jemalloc/branches"
                  src="https://travis-ci.org/LWJGL-CI/jemalloc.svg?branch=master-linux64"
                />
                <BuildBadge
                  title="macOS"
                  href="https://travis-ci.org/LWJGL-CI/jemalloc/branches"
                  src="https://travis-ci.org/LWJGL-CI/jemalloc.svg?branch=master-macosx"
                />
                <BuildBadge
                  title="Windows x64"
                  href="https://ci.appveyor.com/project/LWJGL-CI/jemalloc"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/jemalloc/branch/master-linux64/1"
                />
                <BuildBadge
                  title="Windows x86"
                  href="https://ci.appveyor.com/project/LWJGL-CI/jemalloc"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/jemalloc/branch/master-linux64/2"
                />
              </tbody>
            </table>
          </div>

          <div className="col-lg-4">
            <h2>OpenAL Soft</h2>
            <table className="table table-bordered table-inverse">
              <tbody>
                <BuildBadge
                  title="Linux x64"
                  href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"
                  src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-linux64"
                />
                <BuildBadge
                  title="macOS"
                  href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"
                  src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-macosx"
                />
                <BuildBadge
                  title="Windows x64"
                  href="https://ci.appveyor.com/project/LWJGL-CI/openal-soft"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/openal-soft/branch/master-linux64/1"
                />
                <BuildBadge
                  title="Windows x86"
                  href="https://ci.appveyor.com/project/LWJGL-CI/openal-soft"
                  src="https://appveyor-matrix-badges.herokuapp.com/repos/LWJGL-CI/openal-soft/branch/master-linux64/2"
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  </PageView>
);

export default SourceRoute;
