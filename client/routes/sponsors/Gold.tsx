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
          href="https://www.vpsserver.com/"
          title="VPS HOSTING - GET YOUR FREE VPS TRIAL NOW!"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={218} height={50} src="/img/sponsors/vpsserver.com.svg" alt="VPSSERVER.com" />
        </a>
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
          <ImgLazy width={318 / 1.5} height={64 / 1.5} src="/img/sponsors/bonusfinder-uk.svg" alt="BonusFinder UK" />
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
          href="http://nettikasinot.org/"
          rel="sponsored noopener external"
          target="_blank"
          title="Universumin parhaat nettikasinot"
        >
          <ImgLazy width={585 / 3} height={116 / 3} src="/img/sponsors/nettikasinot-585x116.png" alt="Nettikasinot" />
        </a>
        <a
          href="https://www.nettikasinot.media/"
          title="Nettikasinot: Mitkä ovat parhaat nettikasinot"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={48} height={48} src="/img/sponsors/nettikasinot.media.svg" alt="nettikasinot.media" />
        </a>
        <a
          href="https://www.pelisivut.com/"
          title="Rahapelit netissä laadukkaasti ja luotettavasti"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={620 / 3} height={152 / 3} src="/img/sponsors/pelisivut-620x152.png" alt="PELISIVUT" />
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
          <ImgLazy width={447 / 2} height={119 / 2} src="/img/sponsors/list-casino.svg" alt="list.casino" />
        </a>
        <a href="https://nzcasinohex.com/" title="NZCasinoHex" rel="sponsored noopener external" target="_blank">
          <ImgLazy width={200 / 2} height={51 / 2} src="/img/sponsors/nzcasinohex.png" alt="NZCasinoHex" />
        </a>
        <a
          href="https://www.targetedwebtraffic.com/"
          title="Targeted Web Traffic"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={270 / 4}
            height={243 / 4}
            src="/img/sponsors/targetedwebtraffic-270x243.png"
            alt="Targeted Web Traffic"
          />
        </a>
        <a
          href="https://casino.guide/ethereum/"
          title="Best ETH Casino 2021"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={240 / 2} height={279 / 2} src="/img/sponsors/casino-guide-240x279.png" alt="Casino.guide" />
        </a>
        <a
          href="https://1394ta.org/"
          title="1394TA: Buy Instagram Followers and Likes"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={110} height={47} src="/img/sponsors/1394ta.svg" alt="1394TA" />
        </a>
        <a
          href="https://funrize.com/"
          title="Funrize Social Gaming Platform: Play for Free"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={156 / 2} height={96 / 2} src="/img/sponsors/funrize.png" alt="Funrize" />
        </a>
        <a
          href="https://www.kasinot.fi/"
          title="Kasinot netissä: #1 opas nettikasinoiden maailmaan"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={384 / 3} height={128 / 3} src="/img/sponsors/kasinot-384x128.png" alt="Kasinot.fi" />
        </a>
        <a
            href="https://smålånutensikkerhet.com/"
            title="Smålån uten sikkerhet"
            rel="sponsored noopener external"
            target="_blank"
        >
          <ImgLazy width={129} height={34.5} src="/img/sponsors/smalan.png" alt="Smålån"/>
        </a>
        <a
            href="https://kingcasinobonus.co.uk"
            title="KingCasinoBonus"
            rel="sponsored noopener external"
            target="_blank"
        >
          <ImgLazy width={100} height={100} src="/img/sponsors/kingcasinobonus-100x100.png" alt="KingCasinoBonus" />
        </a>
        <a
            href="https://casinobonusca.com/"
            title="CasinoBonusCa"
            rel="sponsored noopener external"
            target="_blank"
        >
          <ImgLazy width={100} height={100} src="/img/sponsors/casinobonusca-100x100.png" alt="CasinoBonusCa" />
        </a>
        <a
            href="https://casinoalpha.co.nz/"
            title="CasinoAlpha New Zealand"
            rel="sponsored noopener external"
            target="_blank"
        >
          <ImgLazy width={100} height={100} src="/img/sponsors/casinoalphanz-100x100.png" alt="CasinoAlpha New Zealand" />
        </a>
        <a
            href="https://arabcasinohex.com/"
            title="ArabCasinoHEX"
            rel="sponsored noopener external"
            target="_blank"
        >
          <ImgLazy width={166 / 1.5} height={46 / 1.5} src="/img/sponsors/arab-casino-hex-dark.png" alt="ArabCasinoHEX"/>
        </a>
      </Grid>
      {children}
    </SectionContainer>
  </Dark>
);
