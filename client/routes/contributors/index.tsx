import { PageView } from '~/routes/PageView';
import { ImgLazy } from '~/components/ui/ImgLazy';
import { HowToSupport } from './HowToSupport';
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

      <SectionContainer padding>
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
