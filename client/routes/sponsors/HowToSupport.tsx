import { LazyImg } from '~/components/LazyImg';

export const HowToSupport: React.FC<{ children?: never }> = () => (
  <section className="container py-5">
    <div className="row justify-content-center text-center">
      <div className="col-md-9">
        <h1>Supporting this project</h1>

        <p>
          LWJGL exists thanks to{' '}
          <a href="https://github.com/LWJGL/lwjgl3/blob/master/BACKERS.md" target="_blank" rel="noopener external">
            all the people
          </a>{' '}
          who{' '}
          <a
            href="https://github.com/LWJGL/lwjgl3/blob/master/.github/CONTRIBUTING.md"
            target="_blank"
            rel="noopener external"
          >
            contribute
          </a>{' '}
          and back/sponsor our collective.
        </p>

        <p>
          <a href="https://opencollective.com/lwjgl/donate" target="_blank" rel="noopener external">
            <LazyImg width={300} height={50} src="/img/sponsors/donate-blue.png" alt="DONATE TO OUR COLLECTIVE" />
          </a>
        </p>
      </div>
    </div>
  </section>
);
