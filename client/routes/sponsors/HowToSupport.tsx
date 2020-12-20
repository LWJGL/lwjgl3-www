import { ImgLazy } from '~/components/ui/ImgLazy';
import { Text } from '~/components/ui/Text';
import { TitleSection } from '~/components/lwjgl/TitleSection';
import { Anchor } from '~/components/lwjgl/Anchor';
import { Section } from '~/components/ui/Section';

export const HowToSupport: React.FC<{ children?: never; id: string }> = ({ id }) => (
  <Section padding id={id} css={{ sm: { textAlign: 'center' } }}>
    <TitleSection>Supporting this project</TitleSection>
    <Text margin>
      LWJGL exists thanks to{' '}
      <Anchor href="https://github.com/LWJGL/lwjgl3/blob/master/BACKERS.md" target="_blank" rel="noopener external">
        all the people
      </Anchor>{' '}
      who{' '}
      <Anchor
        href="https://github.com/LWJGL/lwjgl3/blob/master/.github/CONTRIBUTING.md"
        target="_blank"
        rel="noopener external"
      >
        contribute
      </Anchor>{' '}
      and back/sponsor our collective.
    </Text>
    <a href="https://opencollective.com/lwjgl/donate" target="_blank" rel="noopener external">
      <ImgLazy width={300} height={50} src="/img/sponsors/donate-blue.png" alt="DONATE TO OUR COLLECTIVE" />
    </a>
  </Section>
);
