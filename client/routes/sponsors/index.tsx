import { PageView } from '~/routes/PageView';
import { ImgLazy } from '~/components/ui/ImgLazy';
import { GoldSponsors } from '../sponsors/Gold';
import { HowToSupport } from '../sponsors/HowToSupport';

import { Grid } from '~/components/layout/Grid';
import { Container } from '~/components/layout/Container';
import { Box } from '~/components/layout/Box';
import { TitleSection } from '~/components/lwjgl/TitleSection';

export default function SponsorsRoute() {
  return (
    <PageView
      title="Sponsors"
      description="LWJGL exists thanks to all the people who contribute and back/sponsor our collective."
    >
      <HowToSupport />
      <GoldSponsors />

      <Container as="section" padding>
        <TitleSection>Silver Sponsors:</TitleSection>
        <Grid
          css={{
            pt: '$sm',
            gap: '$safe',
            mb: '$safe',
            justifyContent: 'center',
            alignItems: 'center',
            // sm: {
            //   textAlign: 'center',
            //   grid: 'auto-flow / repeat(2, 1fr)',
            // },
            // md: {
            //   grid: 'auto-flow / repeat(3, 1fr)',
            // },
            // lg: {
            //   grid: 'auto-flow / repeat(4, 1fr)',
            // },
          }}
        >
          <a
            href="https://goread.io/buy-instagram-followers?utm_source=opencollective&utm_medium=affiliate&utm_campaign=lwjgl"
            rel="sponsored"
            target="_blank"
            title="Buy Instagram Followers with Instant Delivery"
          >
            <ImgLazy width={1133 * 0.25} height={218 * 0.25} src="/img/sponsors/goread-1133x218.png" alt="Goread.io" />
          </a>
        </Grid>

        <TitleSection>Backers:</TitleSection>
        <Box css={{ textAlign: 'center', pt: '$sm', pb: '$gap' }}>
          <img alt="LWJGL backers list" src="https://opencollective.com/lwjgl/backers.svg?width=825" />
        </Box>

        <TitleSection>Contributors:</TitleSection>
        <Box css={{ textAlign: 'center', pt: '$sm' }}>
          <a href="https://github.com/LWJGL/lwjgl3/graphs/contributors">
            <img alt="LWJGL contributors list" src="https://opencollective.com/lwjgl/contributors.svg?width=825" />
          </a>
        </Box>
      </Container>
    </PageView>
  );
}
