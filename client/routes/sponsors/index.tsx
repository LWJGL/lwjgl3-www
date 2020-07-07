import { PageView } from '~/components/routes/PageView';
import { LazyImg } from '~/components/LazyImg';
import { GoldSponsors } from '../sponsors/Gold';
import { HowToSupport } from '../sponsors/HowToSupport';

export default function SponsorsRoute() {
  return (
    <PageView
      title="Sponsors"
      description="LWJGL exists thanks to all the people who contribute and back/sponsor our collective."
    >
      <StaticContent />
    </PageView>
  );
}

const StaticContent = () => (
  <>
    <HowToSupport />
    <GoldSponsors />

    <section className="container pt-5 pb-3">
      <div className="row justify-content-center">
        <div className="col-md-9 text-center">
          <h1>Silver Sponsors:</h1>
          <p>
            <a href="https://ats.io/" rel="sponsored noopener" target="_blank">
              <LazyImg className="m-3" width={64} height={64} src="/img/sponsors/ats.io-1024x1024.png" alt="ATS.io" />
            </a>
            <a href="https://nettikasinolista.com/" rel="sponsored noopener" target="_blank">
              <LazyImg
                className="m-3"
                width={150}
                height={40}
                src="/img/sponsors/nettikasinolista.svg"
                alt="Nettikasinolista"
              />
            </a>
          </p>

          <h1>Backers:</h1>
          <p>
            <img className="img-fluid" src="https://opencollective.com/lwjgl/backers.svg?width=825" />
          </p>

          <h1>Contributors:</h1>
          <p>
            <a href="https://github.com/LWJGL/lwjgl3/graphs/contributors">
              <img className="img-fluid" src="https://opencollective.com/lwjgl/contributors.svg?width=825" />
            </a>
          </p>
        </div>
      </div>
    </section>
  </>
);
