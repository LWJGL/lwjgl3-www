import { ImgLazy } from '~/components/ui/ImgLazy';
import { Grid } from '~/components/layout/Grid';
import { FlexStack } from '~/components/layout/FlexStack';
import { TitleSection } from '~/components/lwjgl/TitleSection';
import { Dark } from '~/components/lwjgl/Dark';
import { Section } from '~/components/ui/Section';

export const GoldSponsors: React.FC = ({ children }) => (
  <Dark>
    <Section padding>
      <TitleSection css={{ color: 'gold' }}>Our Gold Sponsors:</TitleSection>
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
          href="https://www.casinotop.com/"
          title="Online Casino Guide in Canada - Best Gaming Experience!"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={130 * 1.5} height={20 * 1.5} src="/img/sponsors/casinotop-129x20.svg" alt="CASINOTOP" />
        </a>
        {/* <a
          href="https://www.parhaatnettikasinot.com/"
          title="Kaikki luotettavat ja parhaat nettikasinot"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={330.8 * 0.75}
            height={46.4 * 0.75}
            src="/img/sponsors/parhaat-nettikasinot.svg"
            alt="parhaat nettikasinot"
          />
        </a> */}
        <a
          href="https://nettikasinot247.fi/"
          title="KÄRKITASON NETTIKASINOT"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={467 * 0.5}
            height={112 * 0.5}
            src="/img/sponsors/nettikasinot-logo-467x112.png"
            alt="NETTIKASINOT247"
            css={{ filter: 'invert(90%)' }}
          />
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
          href="https://www.turtlebet.com/fi/kaikki-nettikasinot.html"
          title="Kaikki nettikasinot - Katso Turtlebetin kaikki kasinot lista!"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={173}
            height={40}
            src="/img/sponsors/turtlebet-173x40.svg"
            alt="Turtlebet"
            css={{ filter: 'invert(100%) hue-rotate(180deg)' }}
          />
        </a>
        <a
          href="https://www.vpsserver.com/"
          title="VPS HOSTING - GET YOUR FREE VPS TRIAL NOW!"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={218} height={50} src="/img/sponsors/vpsserver.com.svg" alt="VPSSERVER.com" />
        </a>
        <a
          href="https://buy.fineproxy.org/eng/"
          rel="sponsored noopener external"
          target="_blank"
          title="BUY PROXY FROM FINEPROXY"
        >
          <ImgLazy
            width={250 / 1.25}
            height={70 / 1.25}
            src="/img/sponsors/fineproxy-logo-250x70.png"
            alt="Fineproxy"
            css={{ filter: 'invert(90%)' }}
          />
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
          href="https://www.kasinot.fi/"
          title="Kasinot netissä: #1 opas nettikasinoiden maailmaan"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={384 / 3} height={128 / 3} src="/img/sponsors/kasinot-384x128.png" alt="Kasinot.fi" />
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
          href="https://www.pelisivut.com/"
          title="Rahapelit netissä laadukkaasti ja luotettavasti"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={620 / 3} height={152 / 3} src="/img/sponsors/pelisivut-620x152.png" alt="PELISIVUT" />
        </a>
        <a
          href="https://www.casinotopp.net/"
          title="Velkommen til CasinoTopp – Norges beste portal til online casino"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={144 * 1.25} height={20 * 1.25} src="/img/sponsors/casinotopp-143x20.svg" alt="CASINOTOPP" />
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
          href="https://kajino.com/"
          title="オンラインカジノ リストとランキング 2021 - カジノ .com | Kajino"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={189} height={30} src="/img/sponsors/kajino.com-189x30.svg" alt="Kajino.com" />
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
          href="https://www.connessionivpn.it/"
          title="Connessioni VPN"
          rel="sponsored noopener external"
          target="_blank"
        >
          <FlexStack
            gap="0.5rem"
            css={{
              color: '#577BFA',
              fontWeight: 'bold',
              '@md': {
                justifyContent: 'center',
              },
            }}
          >
            <ImgLazy
              width={460 / 8}
              height={279 / 8}
              src="/img/sponsors/connessionivpn.it-460x279.svg"
              alt="Connessioni VPN"
            />{' '}
            <span>CONNESSIONI VPN</span>
          </FlexStack>
        </a>
        <a
          href="https://casinomartini.com/nz/new-online-casinos/"
          title="New Zealand New Online Casinos | Full List of New Casino Sites NZ"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={379 / 2} height={138 / 2} src="/img/sponsors/casino-martini.png" alt="Casino Martini" />
        </a>
        <a
          href="https://goread.io/buy-instagram-followers"
          title="Buy Instagram Followers with Instant Delivery"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={1133 * 0.25} height={218 * 0.25} src="/img/sponsors/goread-1133x218.png" alt="Goread.io" />
        </a>
        {/* <a
          href="https://www.boekonomi.se/"
          title="BoEkonomi.se | Vi hjälper dig ta hand om din ekonomi och ditt boende!"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={200 / 1.5} height={31 / 1.5} src="/img/sponsors/boekonomi-200x31.png" alt="BoEkonomi.se" />
        </a> */}
        <a
          href="https://poprey.com/instagram_views"
          title="Buy Instagram Views"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={90} height={90} src="/img/sponsors/buy-instagram-views.png" alt="" />
        </a>
        <a
          href="https://anbefaltcasino.com/"
          title="Beste norske nettcasinoer finner du på AnbefaltCasino.com"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={154.219 * 1.2}
            height={14.594 * 1.2}
            src="/img/sponsors/sanbefaltcasino.svg"
            alt="AnbefaltCasino.com"
          />
        </a>
        <a
          href="https://list.casino/"
          title="List of All the Best Online Casinos - Ultimate Casino List!"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={447 / 2} height={119 / 2} src="/img/sponsors/list-casino.svg" alt="list.casino" />
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
          href="https://casinoenlineahex.com/"
          title="Casino En Línea HEX"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy
            width={2565}
            height={734}
            style={{ width: 2565 / 13, height: 734 / 13 }}
            src="/img/sponsors/casinoenlineahex.svg"
            alt="Casino En Línea"
          />
        </a>
        <a href="https://nzcasinohex.com/" title="NZCasinoHex" rel="sponsored noopener external" target="_blank">
          <ImgLazy width={200 / 2} height={51 / 2} src="/img/sponsors/nzcasinohex.png" alt="NZCasinoHex" />
        </a>
      </Grid>
      {children}
    </Section>
  </Dark>
);
