import { PageView } from '~/components/routes/PageView';
import { BuildBadge } from './BuildBadge';
import { Icon } from '~/components/Icon';
import '~/components/icons/fa/brands/github';

const SourceRoute: React.FC<{ children?: never }> = () => (
  <PageView title="Source & Build Status" description="Links to LWJGL Github repository and build status matrix">
    <section className="container">
      <h1>
        LW
        <b>JGL</b> Source{' '}
      </h1>

      <iframe
        src="https://ghbtns.com/github-btn.html?user=LWJGL&repo=lwjgl3&type=star&count=true&size=large"
        className="border-0 overflow-hidden mt-1"
        sandbox="allow-scripts allow-popups"
        importance="low"
        loading="lazy"
        referrerPolicy="no-referrer"
        width="145"
        height="30"
        title="Star LWJGL/lwjgl3 on GitHub"
      />

      <p>LWJGL 3 is hosted on Github. Fork, star and contribute to our project!</p>
      <p>
        <a
          className="btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2 btn-success"
          href="https://github.com/LWJGL/lwjgl3"
          rel="noopener external"
        >
          <Icon name="fa/brands/github" /> Github Repository
        </a>
        <a
          className="btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2 btn-outline-dark"
          href="https://github.com/LWJGL/lwjgl3/issues"
          rel="noopener external"
        >
          Issue Tracker
        </a>
        <a
          className="btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2 btn-outline-dark"
          href="https://github.com/LWJGL/lwjgl3/releases"
          rel="noopener external"
        >
          Release notes
        </a>
        <a
          className="btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2 btn-outline-dark"
          href="https://github.com/LWJGL/lwjgl3/commits/master"
          rel="noopener external"
        >
          Changelog
        </a>
      </p>
    </section>

    <section className="container pt-4">
      <h1 className="font-weight-bold">Build Status</h1>
      <hr />
      <div className="row">
        <div className="col-lg-4">
          <h2>LWJGL</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/lwjgl3"
                src="https://api.travis-ci.org/LWJGL-CI/lwjgl3.svg"
              />
              <BuildBadge
                width={106}
                title="Windows"
                href="https://ci.appveyor.com/project/LWJGL-CI/lwjgl3"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/lwjgl3?svg=true"
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
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/assimp"
                src="https://api.travis-ci.org/LWJGL-CI/assimp.svg"
              />
              <BuildBadge
                width={106}
                title="Windows"
                href="https://ci.appveyor.com/project/LWJGL-CI/assimp"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/assimp?svg=true"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>bgfx</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/bgfx"
                src="https://travis-ci.org/LWJGL-CI/bgfx.svg"
              />
              <BuildBadge
                width={106}
                title="Windows"
                href="https://ci.appveyor.com/project/LWJGL-CI/bgfx"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/bgfx?svg=true"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>dyncall</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/dyncall"
                src="https://travis-ci.org/LWJGL-CI/dyncall.svg"
              />
              <BuildBadge
                width={106}
                title="Windows"
                href="https://ci.appveyor.com/project/LWJGL-CI/dyncall"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/dyncall?svg=true"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>GLFW</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/glfw"
                src="https://travis-ci.org/LWJGL-CI/glfw.svg"
              />
              <BuildBadge
                width={106}
                title="Windows"
                href="https://ci.appveyor.com/project/LWJGL-CI/glfw"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/glfw?svg=true"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>jemalloc</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/jemalloc"
                src="https://travis-ci.org/LWJGL-CI/jemalloc.svg"
              />
              <BuildBadge
                title="Windows"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/jemalloc"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/jemalloc?svg=true"
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
                href="https://travis-ci.org/LWJGL-CI/MoltenVK"
                src="https://travis-ci.org/LWJGL-CI/MoltenVK.svg"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>OpenAL Soft</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/openal-soft"
                src="https://travis-ci.org/LWJGL-CI/openal-soft.svg"
              />
              <BuildBadge
                title="Windows"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/openal-soft"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/openal-soft?svg=true"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>Opus</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/opus"
                src="https://travis-ci.org/LWJGL-CI/opus.svg"
              />
              <BuildBadge
                title="Windows"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/opus"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/opus?svg=true"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>Shaderc</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/shaderc"
                src="https://travis-ci.org/LWJGL-CI/shaderc.svg"
              />
              <BuildBadge
                title="Windows"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/shaderc"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/shaderc?svg=true"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>SPIRV-Cross</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/SPIRV-Cross"
                src="https://travis-ci.org/LWJGL-CI/SPIRV-Cross.svg"
              />
              <BuildBadge
                title="Windows"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/SPIRV-Cross"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/SPIRV-Cross?svg=true"
              />
            </tbody>
          </table>
        </div>

        <div className="col-lg-4">
          <h2>TinyCC</h2>
          <table className="table table-bordered table-dark">
            <tbody>
              <BuildBadge
                title="Linux/macOS"
                href="https://travis-ci.org/LWJGL-CI/tinycc"
                src="https://travis-ci.org/LWJGL-CI/tinycc.svg"
              />
              <BuildBadge
                title="Windows"
                width={106}
                href="https://ci.appveyor.com/project/LWJGL-CI/tinycc"
                src="https://ci.appveyor.com/api/projects/status/github/LWJGL-CI/tinycc?svg=true"
              />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </PageView>
);

export default SourceRoute;
