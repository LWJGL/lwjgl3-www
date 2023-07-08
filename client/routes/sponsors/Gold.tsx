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
          href="https://nettikasinolista.com/"
          title="Se paras nettikasino-lista: arvostelut, bonukset ja kokemuksia"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={225} height={60} src="/img/sponsors/nettikasinolista.svg" alt="Nettikasino-lista" />
        </a>
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
          href="https://www.pelisivut.com/"
          title="Rahapelit netissä laadukkaasti ja luotettavasti"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={620 * 0.3} height={152 * 0.3} src="/img/sponsors/pelisivut-620x152.png" alt="PELISIVUT" />
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
        <a href="https://nzcasinohex.com/" title="NZCasinoHex" rel="sponsored noopener external" target="_blank">
          <ImgLazy width={200 * 0.5} height={51 * 0.5} src="/img/sponsors/nzcasinohex.png" alt="NZCasinoHex" />
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
          href="https://smålånutensikkerhet.com/"
          title="Smålån uten sikkerhet"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={129} height={34.5} src="/img/sponsors/smalan.png" alt="Smålån" />
        </a>
        <a
          href="https://kingcasinobonus.co.uk"
          title="KingCasinoBonus"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={436 * 0.25}
            height={245 * 0.25}
            src="/img/sponsors/king-casino-bonus.svg"
            alt="KingCasinoBonus"
          />
        </a>
        <a href="https://casinobonusca.com/" title="CasinoBonusCa" rel="sponsored noopener external" target="_blank">
          <ImgLazy width={100} height={100} src="/img/sponsors/casinobonusca-100x100.png" alt="CasinoBonusCa" />
        </a>
        <a
          href="https://casinoalpha.co.nz/"
          title="CasinoAlpha New Zealand"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={100}
            height={100}
            src="/img/sponsors/casinoalphanz-100x100.png"
            alt="CasinoAlpha New Zealand"
          />
        </a>
        <a href="https://arabcasinohex.com/" title="ArabCasinoHEX" rel="sponsored noopener external" target="_blank">
          <ImgLazy
            width={166 * 0.75}
            height={46 * 0.75}
            src="/img/sponsors/arab-casino-hex-dark.png"
            alt="ArabCasinoHEX"
          />
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
          href="https://www.broadband.deals/"
          title="Broadband.Deals - Best Broadband Plans in December 2022"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={800 / 4}
            height={227 / 4}
            src="/img/sponsors/broadband-deals.png"
            alt="Broadband Deals"
            style={{ filter: 'invert(100%)' }}
          />
        </a>
        <a
          href="https://automatenspielex.com/online-casinos"
          title="Beste Online Casinos"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={157} height={113} src="/img/sponsors/automatenspiele.svg" alt="Automatenspiele" />
        </a>
        <a
          href="https://twicsy.com/buy-instagram-likes"
          title="Buy Instagram Likes with Instant Delivery"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={157} height={113} src="/img/sponsors/twicsy-150x29.svg" alt="Twicsy" />
        </a>
        <a
          href="https://www.nettcasino.com/"
          title="Norway's biggest and most reliable online casino portal"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={739.28/3} height={114.4/3} src="/img/sponsors/nett-casino.svg" alt="Nettcasino" />
        </a>
        <a
          href="https://www.nyecasino.me/"
          title="NyeCasino.me is a website that lists the newest and best online casinos in Norway"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={531/3} height={80/3} src="/img/sponsors/nye-casino-logo.svg" alt="NyeCasino.me" />
        </a>
        <a
          href="https://twicsy.com/buy-instagram-followers"
          title="Buy real Instagram followers from Twicsy starting at only $2.97"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={157} height={113} src="/img/sponsors/twicsy-150x29.svg" alt="Twicsy" />
        </a>
      </Grid>
      {children}
    </SectionContainer>
  </Dark>
);
