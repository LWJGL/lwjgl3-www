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
          textAlign: 'center',
          width: '100%',
          img: {
            maxWidth: '100%',
          },
          // '@sm': {
          //   textAlign: 'center',
          //   grid: 'auto-flow / repeat(2, 1fr)',
          // },
          // '@md': {
          //   grid: 'auto-flow / repeat(3, 1fr)',
          // },
          // '@lg': {
          //   grid: 'auto-flow / repeat(4, 1fr)',
          // },
        }}
      >
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
