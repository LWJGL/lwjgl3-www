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
          <h2>Silver Sponsors:</h2>
          <p>
            {' '}
            <a href="https://moneyarcher.com/se/" rel="sponsored noopener" target="_blank">
              <LazyImg
                className="m-3"
                width={300 / 3}
                height={74 / 3}
                src="/img/sponsors/money-archer-300x74.jpg"
                alt="MoneyArcher"
              />
            </a>
          </p>

          <h2>Backers:</h2>
          <p>
            <img className="img-fluid" src="https://opencollective.com/lwjgl/backers.svg?width=825" />
          </p>

          <h2>Contributors:</h2>
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
