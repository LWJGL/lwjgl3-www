import { LazyImg } from '~/components/LazyImg';

export const GoldSponsors: React.FC<{ children?: never }> = () => (
  <div className="area-dark">
    <section className="container py-5 text-center">
      <h1>Our Gold Sponsors:</h1>
      <div className="d-flex flex-column flex-wrap flex-sm-row justify-content-center align-items-center">
        <a
          href="https://www.vpsserver.com/?utm_source=opencollective&utm_medium=affiliate&utm_campaign=lwjgl"
          rel="sponsored noopener"
          target="_blank"
        >
          <LazyImg className="m-3" width={218} height={50} src="/img/sponsors/vpsserver.com.svg" alt="VPSSERVER.com" />
        </a>
        <a
          href="https://www.bestvpn.co/?utm_source=opencollective&utm_medium=affiliate&utm_campaign=lwjgl"
          rel="sponsored noopener"
          target="_blank"
        >
          <LazyImg className="m-3" width={223} height={42} src="/img/sponsors/bestvpn.png" alt="BestVPN.co" />
        </a>
        <a
          href="https://www.vpnranks.com/?utm_source=opencollective&utm_medium=affiliate&utm_campaign=lwjgl"
          rel="sponsored noopener"
          target="_blank"
        >
          <LazyImg className="m-3" width={50} height={50} src="/img/sponsors/vpnranks-white.png" alt="VPNRanks.com" />
        </a>
        <a
          href="https://www.casinotop.com/?utm_source=opencollective&utm_medium=affiliate&utm_campaign=lwjgl"
          rel="sponsored noopener"
          target="_blank"
        >
          <LazyImg className="m-3" width={64} height={64} src="/img/sponsors/casinotop.png" alt="Money Pug" />
        </a>
        <a
          href="https://www.bonus.net.nz/?utm_source=opencollective&utm_medium=affiliate&utm_campaign=lwjgl"
          rel="sponsored noopener"
          target="_blank"
        >
          <LazyImg
            className="m-3"
            width={179.71}
            height={38}
            src="/img/sponsors/bonusfindernz.svg"
            alt="BonusFinder New Zealand"
          />
        </a>
        <a
          href="https://www.bonusfinder.com/?utm_source=opencollective&utm_medium=affiliate&utm_campaign=lwjgl"
          rel="sponsored noopener"
          target="_blank"
        >
          <LazyImg
            className="m-3"
            width={179.71}
            height={38}
            src="/img/sponsors/bonusfinderus.svg"
            alt="BonusFinder USA"
          />
        </a>
        <a href="http://smålånutensikkerhet.com/" rel="noopener" target="_blank">
          <LazyImg
            className="m-3"
            width={129}
            height={34.5}
            style={{ padding: '4px 3px 4px 2px', background: 'white' }}
            src="/img/sponsors/smalan.png"
            alt="Smålån uten sikkerhet"
          />
        </a>
        <a href="http://nettikasinot.org/" rel="sponsored noopener" target="_blank">
          <LazyImg
            className="m-3"
            width={585 / 3}
            height={116 / 3}
            src="/img/sponsors/nettikasinot-585x116.png"
            alt="Nettikasinot"
          />
        </a>
        <a href="https://www.turtlebet.com/fi/kaikki-nettikasinot.html" rel="sponsored noopener" target="_blank">
          <LazyImg
            className="m-3"
            width={632 / 3}
            height={172 / 3}
            src="/img/sponsors/turtlebet-632x172.png"
            alt="Turtle Bet"
          />
        </a>
        <a href="https://www.kasinot.fi/" rel="sponsored noopener" target="_blank">
          <LazyImg
            className="m-3"
            width={384 / 3}
            height={128 / 3}
            src="/img/sponsors/kasinot-384x128.png"
            alt="Kasinot.fi"
          />
        </a>
        <a href="https://www.pelisivut.com/" rel="sponsored noopener" target="_blank">
          <LazyImg
            className="m-3"
            width={620 / 3}
            height={152 / 3}
            src="/img/sponsors/pelisivut-620x152.png"
            alt="PELISIVUT"
          />
        </a>
        <a href="https://casinohex.se/online-casinon/" rel="sponsored noopener" target="_blank">
          <LazyImg
            className="m-3"
            width={170}
            height={60}
            src="/img/sponsors/casinohex_se_170x60px.svg"
            style={{ padding: '4px 3px 4px 2px', background: 'white' }}
            alt="#1 Sweden Online Casinos Guide"
          />
        </a>
        <a href="https://casinohex.co.za/online-casinos/" rel="sponsored noopener" target="_blank">
          <LazyImg
            className="m-3"
            width={170}
            height={60}
            src="/img/sponsors/casinohex_za_170x60px.svg"
            style={{ padding: '4px 3px 4px 2px', background: 'white' }}
            alt="Best South African Online Gambling Guide"
          />
        </a>
        <a href="https://www.parhaatnettikasinot.com/" rel="sponsored noopener" target="_blank">
          <LazyImg
            className="m-3"
            width={330.8}
            height={46.4}
            src="/img/sponsors/parhaat-nettikasinot.svg"
            alt="parhaat nettikasinot"
          />
        </a>
      </div>
    </section>
  </div>
);
