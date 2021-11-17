import { PageView } from '~/routes/PageView';
import { ImgLazy } from '~/components/ui/ImgLazy';
import { GoldSponsors } from '../sponsors/Gold';
import { HowToSupport } from '../sponsors/HowToSupport';
import { SectionContainer } from '~/components/ui/Section';
import { Box } from '~/components/ui/Box';
import { TitleSection } from '~/components/lwjgl/TitleSection';

export default function SponsorsRoute() {
  return (
    <PageView
      title="Sponsors"
      description="LWJGL exists thanks to all the people who contribute and back/sponsor our collective."
    >
      <HowToSupport />
      <GoldSponsors />

      <SectionContainer padding>
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
      </SectionContainer>
    </PageView>
  );
}
