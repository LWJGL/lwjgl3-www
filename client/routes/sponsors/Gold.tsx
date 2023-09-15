import { ImgLazy } from '~/components/ui/ImgLazy';
import { Grid } from '~/components/layout/Grid';
import { TitleSection } from '~/components/lwjgl/TitleSection';
import { Dark } from '~/components/lwjgl/Dark';
import { SectionContainer } from '~/components/ui/Section';

export const GoldSponsors: FCC = ({ children }) => (
  <Dark>
    <SectionContainer padding>
      <TitleSection>
        Our <span style={{ color: 'gold' }}>Gold</span> Sponsors:
      </TitleSection>
      <Grid
        css={{
          pt: '$gap',
          gap: '$safe',
          alignItems: 'center',
          width: '100%',
          img: {
            maxWidth: '100%',
          },
          '@sm': {
            textAlign: 'center',
            grid: 'auto-flow / repeat(2, 1fr)',
          },
          '@md': {
            grid: 'auto-flow / repeat(3, 1fr)',
          },
          '@lg': {
            grid: 'auto-flow / repeat(4, 1fr)',
          },
        }}
      >
        <a
          href="https://www.bonusfinder.com/"
          title="Online Gambling at Bonusfinder USA"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={179.71} height={38} src="/img/sponsors/bonusfinderus.svg" alt="BonusFinder USA" />
        </a>
        <a
          href="https://www.bonusfinder.co.uk/"
          title="Best Online Gambling Sites UK"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={318 * 0.5} height={64 * 0.5} src="/img/sponsors/bonusfinder-uk.svg" alt="BonusFinder UK" />
        </a>
        <a
          href="https://www.bonus.net.nz/free-spins-no-deposit"
          title="Free Spins No Deposit"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={179.71} height={38} src="/img/sponsors/bonusfindernz.svg" alt="BonusFinder New Zealand" />
        </a>
        <a
          href="https://goread.io/buy-instagram-followers"
          title="Buy Instagram Followers with Instant Delivery"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={1133 * 0.25} height={218 * 0.25} src="/img/sponsors/goread-1133x218.png" alt="Goread.io" />
        </a>
        <a
          href="https://list.casino/"
          title="List of All the Best Online Casinos - Ultimate Casino List!"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={447 * 0.5} height={119 * 0.5} src="/img/sponsors/list-casino.svg" alt="list.casino" />
        </a>
        <a
          href="https://casino.guide/ethereum/"
          title="Best ETH Casino 2021"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={240 * 0.5}
            height={279 * 0.5}
            src="/img/sponsors/casino-guide-240x279.png"
            alt="Casino.guide"
          />
        </a>
        <a
          href="https://funrize.com/"
          title="Funrize Social Gaming Platform: Play for Free"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={156 * 0.5} height={96 * 0.5} src="/img/sponsors/funrize.png" alt="Funrize" />
        </a>
        <a
          href="https://www.kasinot.fi/"
          title="Kasinot netissä: #1 opas nettikasinoiden maailmaan"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={384 * 0.3} height={128 * 0.3} src="/img/sponsors/kasinot-384x128.png" alt="Kasinot.fi" />
        </a>
        <a
          href="https://www.bonukset.fi/"
          title="Parhaat bonukset netin rahapeleihin | Bonukset.fi"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={400 * 0.5}
            height={120 * 0.5}
            src="/img/sponsors/bonukset.png"
            alt="Bonukset.fi"
            style={{ background: 'white' }}
          />
        </a>
        <a
          href="https://www.socialboosting.com/"
          title="SocialBoosting | Grow Social Media Followers, Likes & Views"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={134.769} height={46.307} src="/img/sponsors/social-boosting.svg" alt="SocialBoosting" />
        </a>
        <a
          href="https://automatenspielex.com/online-casinos"
          title="Beste Online Casinos"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={157} height={113} src="/img/sponsors/automatenspiele.svg" alt="Automatenspiele" />
        </a>
      </Grid>
      {children}
    </SectionContainer>
  </Dark>
);
