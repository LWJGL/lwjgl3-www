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
              when: {
                sm: {
                  grid: 'auto-flow / repeat(2, 1fr)',
                  justifyContent: 'center',
                  textAlign: 'center',
                },
                md: {
                  grid: 'auto-flow / repeat(3, 1fr)',
                },
                lg: {
                  grid: 'auto-flow / repeat(4, 1fr)',
                },
              },
            }}
          >
            <a
              href="https://goread.io/buy-instagram-followers"
              title="Buy Instagram Followers with Instant Delivery"
              rel="sponsored noopener external"
              target="_blank"
            >
              <ImgLazy
                width={1133 * 0.25}
                height={218 * 0.25}
                src="/img/sponsors/goread-1133x218.png"
                alt="Goread.io"
              />
            </a>
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
                  when: {
                    md: {
                      justifyContent: 'center',
                    },
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
          </Grid>
        </Section>
      </GoldSponsors>

      <Container as="section" padding>
        <TitleSection>Backers:</TitleSection>
        <Box css={{ textAlign: 'center', pt: '$sm', pb: '$gap' }}>
          <ImgLazy alt="LWJGL backers list" src="https://opencollective.com/lwjgl/backers.svg?width=825" />
        </Box>

        <TitleSection>Contributors:</TitleSection>
        <Box css={{ textAlign: 'center', pt: '$sm' }}>
          <a href="https://github.com/LWJGL/lwjgl3/graphs/contributors">
            <ImgLazy alt="LWJGL contributors list" src="https://opencollective.com/lwjgl/contributors.svg?width=825" />
          </a>
        </Box>
      </Container>
    </PageView>
  );
}
