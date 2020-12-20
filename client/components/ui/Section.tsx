import { useRef } from 'react';
import { useContentVisibility } from '~/hooks/useContentVisibility';
import { Container } from '~/components/layout/Container';
import type { ContainerProps } from '~/components/layout/Container';

export const Section: React.FC<ContainerProps> = ({ children, css, ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  useContentVisibility(ref);

  return (
    //@ts-expect-error
    <Container css={{ ...css, contentVisibility: 'auto' }} ref={ref} as="section" {...rest}>
      {children}
    </Container>
  );
};
