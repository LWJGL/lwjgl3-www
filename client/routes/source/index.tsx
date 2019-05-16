import React from 'react';
import { PageView } from '~/components/routes/PageView';
import { RouteComponentProps, WindowLocation } from '@reach/router';
import { Icon, Github } from '~/components/icons';
import { BuildBadge } from './BuildBadge';

const SourceRoute = (props: RouteComponentProps) => (
  <PageView
    location={props.location as WindowLocation}
    title="Source & Build Status"
    description="Links to LWJGL Github repository and build status matrix"
  >
    <section className="container pb-5">
      <h1>
        LW
        <b>JGL</b> Source
      </h1>

      <p>LWJGL 3 is hosted on Github. Fork, star and contribute to our project!</p>
      <p>
        <a className="btn btn-xs-block btn-success" href="https://github.com/LWJGL/lwjgl3" rel="noopener external">
          <Icon children={<Github />} /> Github Repository
        </a>
        <a
          className="btn btn-xs-block btn-outline-dark"
          href="https://github.com/LWJGL/lwjgl3/releases"
          rel="noopener external"
        >
          Release notes
        </a>
        <a
          className="btn btn-xs-block btn-outline-dark"
          href="https://github.com/LWJGL/lwjgl3/commits/master"
          rel="noopener external"
        >
          Changelog
        </a>
      </p>

      <p>LWJGL's issue tracker is also hosted on Github.</p>
      <a
        className="btn btn-xs-block btn-outline-dark"
        href="https://github.com/LWJGL/lwjgl3/issues"
        rel="noopener external"
      >
        Issue Tracker
      </a>
    </section>

    <hr />

    <section className="container pt-4">
      <h1 className="pb-4">Build Status</h1>
      <div className="row">
        <div className="col-lg-4">
          <h2>LWJGL</h2>
          <table className="table table-bordered table-dark">
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
                width={106}
                title="Windows x64"
                href="https://ci.appveyor.com/project/LWJGL-CI/lwjgl3"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/lwjgl3?svg=true&branch=master-linux64&job=1"
              />
              <BuildBadge
                width={106}
                title="Windows x86"
                href="https://ci.appveyor.com/project/LWJGL-CI/lwjgl3"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/lwjgl3?svg=true&branch=master-linux64&job=2"
              />
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <h2>Assimp</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux x64"
                href="https://travis-ci.org/LWJGL-CI/assimp/branches"
                src="https://travis-ci.org/LWJGL-CI/assimp.svg?branch=master"
              />
              <BuildBadge
                title="Linux ARMhf"
                href="https://travis-ci.org/LWJGL-CI/assimp/branches"
                src="https://travis-ci.org/LWJGL-CI/assimp.svg?branch=master-linux-arm32"
              />
              <BuildBadge
                title="Linux ARM64"
                href="https://travis-ci.org/LWJGL-CI/assimp/branches"
                src="https://travis-ci.org/LWJGL-CI/assimp.svg?branch=master-linux-arm64"
              />
              <BuildBadge
                title="macOS"
                href="https://travis-ci.org/LWJGL-CI/assimp/branches"
                src="https://travis-ci.org/LWJGL-CI/assimp.svg?branch=master-macos"
              />
              <BuildBadge
                width={106}
                title="Windows x64"
                href="https://ci.appveyor.com/project/LWJGL-CI/assimp"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/assimp?svg=true&branch=master&job=1"
              />
              <BuildBadge
                width={106}
                title="Windows x86"
                href="https://ci.appveyor.com/project/LWJGL-CI/assimp"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/assimp?svg=true&branch=master&job=2"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>bgfx</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux x64"
                href="https://travis-ci.org/LWJGL-CI/bgfx/branches"
                src="https://travis-ci.org/LWJGL-CI/bgfx.svg?branch=master-linux"
              />
              <BuildBadge
                title="Linux ARMhf"
                href="https://travis-ci.org/LWJGL-CI/bgfx/branches"
                src="https://travis-ci.org/LWJGL-CI/bgfx.svg?branch=master-linux-arm32"
              />
              <BuildBadge
                title="Linux ARM64"
                href="https://travis-ci.org/LWJGL-CI/bgfx/branches"
                src="https://travis-ci.org/LWJGL-CI/bgfx.svg?branch=master-linux-arm64"
              />
              <BuildBadge
                title="macOS"
                href="https://travis-ci.org/LWJGL-CI/bgfx/branches"
                src="https://travis-ci.org/LWJGL-CI/bgfx.svg?branch=master-macos"
              />
              <BuildBadge
                width={106}
                title="Windows x64"
                href="https://ci.appveyor.com/project/LWJGL-CI/bgfx"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/bgfx?svg=true&branch=master-linux&job=1"
              />
              <BuildBadge
                width={106}
                title="Windows x86"
                href="https://ci.appveyor.com/project/LWJGL-CI/bgfx"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/bgfx?svg=true&branch=master-linux&job=2"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>dyncall</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux x64"
                href="https://travis-ci.org/LWJGL-CI/dyncall/branches"
                src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-linux64"
              />
              <BuildBadge
                title="Linux ARMhf"
                href="https://travis-ci.org/LWJGL-CI/dyncall/branches"
                src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-linux-arm32"
              />
              <BuildBadge
                title="Linux ARM64"
                href="https://travis-ci.org/LWJGL-CI/dyncall/branches"
                src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-linux-arm64"
              />
              <BuildBadge
                title="macOS"
                href="https://travis-ci.org/LWJGL-CI/dyncall/branches"
                src="https://travis-ci.org/LWJGL-CI/dyncall.svg?branch=master-macosx"
              />
              <BuildBadge
                width={106}
                title="Windows x64"
                href="https://ci.appveyor.com/project/LWJGL-CI/dyncall"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/dyncall?svg=true&branch=master-linux64&job=1"
              />
              <BuildBadge
                width={106}
                title="Windows x86"
                href="https://ci.appveyor.com/project/LWJGL-CI/dyncall"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/dyncall?svg=true&branch=master-linux64&job=2"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>GLFW</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux x64"
                href="https://travis-ci.org/LWJGL-CI/glfw/branches"
                src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-linux64"
              />
              <BuildBadge
                title="Linux ARMhf"
                href="https://travis-ci.org/LWJGL-CI/glfw/branches"
                src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-linux-arm32"
              />
              <BuildBadge
                title="Linux ARM64"
                href="https://travis-ci.org/LWJGL-CI/glfw/branches"
                src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-linux-arm64"
              />
              <BuildBadge
                title="macOS"
                href="https://travis-ci.org/LWJGL-CI/glfw/branches"
                src="https://travis-ci.org/LWJGL-CI/glfw.svg?branch=master-macosx"
              />
              <BuildBadge
                width={106}
                title="Windows x64"
                href="https://ci.appveyor.com/project/LWJGL-CI/glfw"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/glfw?svg=true&branch=master-linux64&job=1"
              />
              <BuildBadge
                width={106}
                title="Windows x86"
                href="https://ci.appveyor.com/project/LWJGL-CI/glfw"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/glfw?svg=true&branch=master-linux64&job=2"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>jemalloc</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux x64"
                href="https://travis-ci.org/LWJGL-CI/jemalloc/branches"
                src="https://travis-ci.org/LWJGL-CI/jemalloc.svg?branch=master-linux64"
              />
              <BuildBadge
                title="Linux ARMhf"
                href="https://travis-ci.org/LWJGL-CI/jemalloc/branches"
                src="https://travis-ci.org/LWJGL-CI/jemalloc.svg?branch=master-linux-arm32"
              />
              <BuildBadge
                title="Linux ARM64"
                href="https://travis-ci.org/LWJGL-CI/jemalloc/branches"
                src="https://travis-ci.org/LWJGL-CI/jemalloc.svg?branch=master-linux-arm64"
              />
              <BuildBadge
                title="macOS"
                href="https://travis-ci.org/LWJGL-CI/jemalloc/branches"
                src="https://travis-ci.org/LWJGL-CI/jemalloc.svg?branch=master-macosx"
              />
              <BuildBadge
                title="Windows x64"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/jemalloc"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/jemalloc?svg=true&branch=master-linux64&job=1"
              />
              <BuildBadge
                title="Windows x86"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/jemalloc"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/jemalloc?svg=true&branch=master-linux64&job=2"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>OpenAL Soft</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux x64"
                href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"
                src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-linux64"
              />
              <BuildBadge
                title="Linux ARMhf"
                href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"
                src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-linux-arm32"
              />
              <BuildBadge
                title="Linux ARM64"
                href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"
                src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-linux-arm64"
              />
              <BuildBadge
                title="macOS"
                href="https://travis-ci.org/LWJGL-CI/openal-soft/branches"
                src="https://travis-ci.org/LWJGL-CI/openal-soft.svg?branch=master-macosx"
              />
              <BuildBadge
                title="Windows x64"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/openal-soft"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/openal-soft?svg=true&branch=master-linux64&job=1"
              />
              <BuildBadge
                title="Windows x86"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/openal-soft"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/openal-soft?svg=true&branch=master-linux64&job=2"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>Opus</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux x64"
                href="https://travis-ci.org/LWJGL-CI/opus/branches"
                src="https://travis-ci.org/LWJGL-CI/opus.svg?branch=master"
              />
              <BuildBadge
                title="Linux ARMhf"
                href="https://travis-ci.org/LWJGL-CI/opus/branches"
                src="https://travis-ci.org/LWJGL-CI/opus.svg?branch=master-linux-arm32"
              />
              <BuildBadge
                title="Linux ARM64"
                href="https://travis-ci.org/LWJGL-CI/opus/branches"
                src="https://travis-ci.org/LWJGL-CI/opus.svg?branch=master-linux-arm64"
              />
              <BuildBadge
                title="macOS"
                href="https://travis-ci.org/LWJGL-CI/opus/branches"
                src="https://travis-ci.org/LWJGL-CI/opus.svg?branch=master-macos"
              />
              <BuildBadge
                title="Windows x64"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/opus"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/opus?svg=true&branch=master&job=1"
              />
              <BuildBadge
                title="Windows x86"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/opus"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/opus?svg=true&branch=master&job=2"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>MoltenVK</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="macOS"
                href="https://travis-ci.org/LWJGL-CI/MoltenVK/branches"
                src="https://travis-ci.org/LWJGL-CI/MoltenVK.svg?branch=master"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>TinyCC</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux x64"
                href="https://travis-ci.org/LWJGL-CI/tinycc/branches"
                src="https://travis-ci.org/LWJGL-CI/tinycc.svg?branch=mob"
              />
              <BuildBadge
                title="Linux ARMhf"
                href="https://travis-ci.org/LWJGL-CI/tinycc/branches"
                src="https://travis-ci.org/LWJGL-CI/tinycc.svg?branch=mob-linux-arm32"
              />
              <BuildBadge
                title="Linux ARM64"
                href="https://travis-ci.org/LWJGL-CI/tinycc/branches"
                src="https://travis-ci.org/LWJGL-CI/tinycc.svg?branch=mob-linux-arm64"
              />
              <BuildBadge
                title="macOS"
                href="https://travis-ci.org/LWJGL-CI/tinycc/branches"
                src="https://travis-ci.org/LWJGL-CI/tinycc.svg?branch=mob-macos"
              />
              <BuildBadge
                title="Windows x64"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/tinycc"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/tinycc?svg=true&branch=mob&job=1"
              />
              <BuildBadge
                title="Windows x86"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/tinycc"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/tinycc?svg=true&branch=mob&job=2"
              />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </PageView>
);

export default SourceRoute;
