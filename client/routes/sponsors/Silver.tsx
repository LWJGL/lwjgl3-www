import { ImgLazy } from '~/components/ui/ImgLazy';
import { Grid } from '~/components/layout/Grid';
import { TitleSection } from '~/components/lwjgl/TitleSection';
import { Dark } from '~/components/lwjgl/Dark';
import { SectionContainer } from '~/components/ui/Section';

export const SilverSponsors: FCC = ({ children }) => (
  <Dark>
    <SectionContainer padding>
      <TitleSection>
        Our <span style={{ color: 'silver' }}>Silver</span> Sponsors:
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
          // '@sm': {
          //   textAlign: 'center',
          //   grid: 'auto-flow / repeat(1, 1fr)',
          // },
          '@sm': {
            textAlign: 'center',
            grid: 'auto-flow / repeat(2, 1fr)',
          },
          '@md': {
            grid: 'auto-flow / repeat(3, 1fr)',
          },
          // '@lg': {
          //   grid: 'auto-flow / repeat(4, 1fr)',
          // },
        }}
      >
        <a
          href="https://uk.onlinecasino.kyiv.ua/"
          title="Онлайн казино України топ рейтинг казино на гроші 2022"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={109} height={36} src="/img/sponsors/ukraine-online-casino.png" alt="onlinecasino.kyiv.ua" />
        </a>
        <a
          href="https://twicsy.com/buy-instagram-likes"
          title="Boost Your Instagram Presence in Minutes!"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={135} height={28} src="/img/sponsors/twicsy-135x28.svg" alt="Twicsy" />
        </a>
        <a
          href="https://slotoking.ua"
          title="Gives a fun for our users"
          rel="sponsored noopener external"
          target="_blank"
        >
          <ImgLazy width={135} height={28} src="/img/sponsors/slotoking-324x56.svg" alt="Игровые автоматы" />
        </a>
      </Grid>
      {children}
    </SectionContainer>
  </Dark>
);
