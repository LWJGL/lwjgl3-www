import { styled } from '~/theme/stitches.config';
import { useDocumentTitle } from '~/hooks/useDocumentTitle';
import { Container } from '~/components/ui/Container';
import { Text } from '~/components/ui/Text';
import { Title } from '~/components/lwjgl/Title';

import type { ErrorProps } from '~/components/system/ErrorBoundary';

function readableStack(stack: string) {
  const href = new URL(document.location.href);
  const rootUrl = `${href.protocol}//${href.hostname}/`;
  const regExp = new RegExp(`${rootUrl}`, 'g');

  return stack.replace(regExp, '');
}

const TitleSection = styled('section', Container, { textAlign: 'center' });
const ErrorStackPre = styled('pre', Container, {
  color: '$critical600',
  fontSize: '$sm',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

export function PageError({ error }: ErrorProps) {
  useDocumentTitle('An error has occured');

  return (
    <>
      <TitleSection padding>
        <Title>Something went wrong</Title>
        <Text>Oh no! It appears that the page has crashed or failed to load.</Text>
        <Text css={{ color: '$critical600' }}>{error.message}</Text>
      </TitleSection>
      <ErrorStackPre padding>
        {FLAG_PRODUCTION || error.stack == null ? null : <code>{readableStack(error.stack)}</code>}
      </ErrorStackPre>
    </>
  );
}
