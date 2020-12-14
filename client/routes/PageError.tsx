import { useDocumentTitle } from '~/hooks/useDocumentTitle';
import { Container } from '~/components/layout/Container';
import { Text } from '~/components/ui/Text';
import { Title } from '~/components/lwjgl/Title';

import type { ErrorProps } from '~/components/ErrorBoundary';

function readableStack(stack: string) {
  const href = new URL(document.location.href);
  const rootUrl = `${href.protocol}//${href.hostname}/`;
  const regExp = new RegExp(`${rootUrl}`, 'g');

  return stack.replace(regExp, '');
}

export function PageError({ error }: ErrorProps) {
  useDocumentTitle('An error has occured');

  return (
    <>
      <Container as="section" padding css={{ textAlign: 'center' }}>
        <Title
          css={
            {
              // pb: '$2',
            }
          }
        >
          Something went wrong
        </Title>
        <Text>Oh no! It appears that the page has crashed or failed to load.</Text>
        <Text css={{ color: '$critical600' }}>{error.message}</Text>
      </Container>
      <Container
        as="pre"
        padding
        css={{
          // mt: '$6',
          // py: '$6',
          color: '$critical600',
          fontSize: '$sm',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {FLAG_PRODUCTION || error.stack == null ? null : <code>{readableStack(error.stack)}</code>}
      </Container>
    </>
  );
}
