import { PageView } from '~/routes/PageView';
import { ImgLazy } from '~/components/ui/ImgLazy';
import { GoldSponsors } from '../sponsors/Gold';
import { HowToSupport } from '../sponsors/HowToSupport';
import { Grid } from '~/components/layout/Grid';
import { FlexStack } from '~/components/layout/FlexStack';
import { Container } from '~/components/layout/Container';
import { Box } from '~/components/layout/Box';
import { Section } from '~/components/ui/Section';
import { TitleSection } from '~/components/lwjgl/TitleSection';

export default function SponsorsRoute() {
  return (
    <PageView
      title="Sponsors"
      description="LWJGL exists thanks to all the people who contribute and back/sponsor our collective."
    >
      <HowToSupport />
      <GoldSponsors>
        <Section css={{ pt: '$lg' }}>
          <hr />
          <TitleSection css={{ pt: '$lg', color: 'silver' }}>Silver Sponsors:</TitleSection>
          <Grid
            css={{
              pt: '$sm',
              gap: '$safe',
              alignItems: 'center',
              '@sm': {
                grid: 'auto-flow / repeat(2, 1fr)',
                justifyContent: 'center',
                textAlign: 'center',
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
              href="https://www.vpnconexion.es/vpn-gratis/"
              title="VPN CONEXIÓN"
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
                  alt="VPN CONEXIÓN"
                />{' '}
                <span>VPN CONEXIÓN</span>
              </FlexStack>
            </a>
            {/* <a
              href="https://writersperhour.com/"
              title="Writers Per Hour"
              rel="sponsored noopener external"
              target="_blank"
            >
              <ImgLazy
                width={466 / 3}
                height={200 / 3}
                src="/img/sponsors/writers-per-hour.png"
                alt="Writers Per Hour"
              />
            </a> */}
          </Grid>
        </Section>
      </GoldSponsors>

      <Container as="section" padding>
        <TitleSection>Backers:</TitleSection>
        <Box css={{ textAlign: 'center', pt: '$sm', pb: '$gap' }}>
          <ImgLazy
            css={{
              maxWidth: '100%',
            }}
            alt="LWJGL backers list"
            src="https://opencollective.com/lwjgl/backers.svg?width=825"
          />
        </Box>

        <TitleSection>Contributors:</TitleSection>
        <Box css={{ textAlign: 'center', pt: '$sm' }}>
          <a href="https://github.com/LWJGL/lwjgl3/graphs/contributors">
            <ImgLazy
              css={{
                maxWidth: '100%',
              }}
              alt="LWJGL contributors list"
              src="https://opencollective.com/lwjgl/contributors.svg?width=825"
            />
          </a>
        </Box>
      </Container>
    </PageView>
  );
}
