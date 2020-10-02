import { PageView } from '~/components/routes/PageView';
import { LinkButton } from '~/components/LinkButton';
import { CustomizePreload, BrowsePreload } from '../';
import { Icon } from '~/components/Icon';
import '~/components/icons/fa/brands/github';
import '~/components/icons/fa/solid/check-square';
import '~/components/icons/fa/solid/folder';

const DownloadRoute: React.FC<{ children?: never }> = () => (
  <PageView title="Download" description="Download LWJGL 3">
    <section className="container pb-4">
      <h1>
        Download LW
        <b>JGL</b> 3
      </h1>
      <hr />
      <div className="row">
        <div className="col-md-12 col-lg-4">
          <p>All official releases are available for download from GitHub:</p>
          <p>
            <a
              className="btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2 btn-lg btn-dark"
              href="https://github.com/LWJGL/lwjgl3/releases"
              target="_blank"
              rel="noopener external"
            >
              <Icon name="fa/brands/github" /> Download from Github
            </a>
          </p>
        </div>
        <div className="col-md-12 col-lg-4" onMouseOver={CustomizePreload}>
          <p>You can customize your LWJGL build or use the latest stable & nightly releases:</p>
          <p>
            <LinkButton className="btn-lg btn-dark" to="/customize">
              <Icon name="fa/solid/check-square" /> Customize LWJGL 3
            </LinkButton>
          </p>
        </div>
        <div className="col-md-12 col-lg-4" onMouseOver={BrowsePreload}>
          <p>Or you can browse and download individual LWJGL artifacts:</p>
          <p>
            <LinkButton className="btn-lg btn-outline-dark" to="/browse">
              <Icon name="fa/solid/folder" /> Browse LWJGL files
            </LinkButton>
          </p>
        </div>
      </div>
    </section>

    <div className="area-dark py-5">
      <section className="container">
        <h3>Build from source?</h3>
        <p>Click below if you prefer to build from source:</p>
        <p>
          <LinkButton className="btn-info" to="/source">
            Source
          </LinkButton>
          <LinkButton className="btn-info" to="/guide#build-instructions">
            Build instructions
          </LinkButton>
        </p>
      </section>
    </div>

    <section className="container py-4">
      <p>
        Broken download? Let us know at the{' '}
        <a href="http://forum.lwjgl.org/" rel="noopener external">
          forums
        </a>
        .
      </p>

      <h2>Looking for LWJGL 2?</h2>

      <p>LWJGL 2 has moved but is still available. Please follow the links below to find what you're looking for:</p>
      <p>
        <a
          className="btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2 btn-outline-primary"
          href="http://legacy.lwjgl.org/"
          rel="noopener external"
        >
          LWJGL 2 WEBSITE
        </a>
        <a
          className="btn d-block d-sm-inline-block mb-2 mb-sm-0 mr-sm-2 btn-outline-primary"
          href="http://wiki.lwjgl.org/"
          rel="noopener external"
        >
          LWJGL 2 WIKI
        </a>
      </p>
    </section>
  </PageView>
);

export default DownloadRoute;
