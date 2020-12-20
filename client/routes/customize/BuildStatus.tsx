import type { BuildType } from './types';
import { Text } from '~/components/ui/Text';
import { readStatus } from './loaders/build-status';

interface Props {
  name: BuildType;
}

export const BuildStatus = ({ name }: Props) => {
  const status = readStatus(name);

  return (
    <Text size="sm" css={{ color: 'error' in status ? '$critical700' : '$neutral700' }}>
      {'error' in status ? status.error : status.version}
      <br />
      {'lastModified' in status ? status.lastModified : <br />}
    </Text>
  );
};
