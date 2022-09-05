import { useStore } from './store';
import { Anchor } from '~/components/lwjgl/Anchor';
import type { BuildStore } from './types';

const selector = (state: BuildStore) => state.version;

export const BuildReleaseNotes: React.FC<{ children?: never }> = () => {
  const version = useStore(selector);

  return (
    <p>
      <Anchor
        css={{ fontSize: '$xs' }}
        href={`https://github.com/LWJGL/lwjgl3/releases/tag/${version}`}
        rel="noopener external"
        target="_blank"
      >
        release notes for {version}
      </Anchor>
    </p>
  );
};
