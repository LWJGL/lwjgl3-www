import { useRef } from 'react';
import { styled } from '~/theme/stitches.config';
import { Container } from '~/components/ui/Container';
import { useContentVisibility } from '~/hooks/useContentVisibility';

export const Section = styled('section');

export const SectionContainer = styled('section', Container);

const SectionContentVisibilityPlain: React.FC<React.HTMLProps<HTMLDivElement>> = ({ children, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  useContentVisibility(ref);

  return (
    <section ref={ref} {...rest}>
      {children}
    </section>
  );
};

export const SectionContentVisibility = styled(SectionContentVisibilityPlain, Container, {
  contentVisibility: 'auto',
});
