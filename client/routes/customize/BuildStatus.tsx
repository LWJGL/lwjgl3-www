import { use } from 'react';
import { Text } from '~/components/ui/Text';
import { getBuildStatus } from './loaders/build-status';

import type { BuildType } from './types';

interface Props {
  name: BuildType;
}

const fmt = new Intl.DateTimeFormat([], {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
});

function renderVersion(version: string, name: BuildType) {
  if (name !== 'release') {
    return version;
  }

  return version.split('build')[0].trim();
}

export const BuildStatus = ({ name }: Props) => {
  const status = use(getBuildStatus(name));

  return (
    <Text
      size="sm"
      css={{
        fontFamily: '$mono',
        color: 'error' in status ? '$critical9' : 'inherit',
      }}
    >
      {'error' in status ? status.error : renderVersion(status.version, name)}
      <br />
      {'lastModified' in status ? fmt.format(new Date(status.lastModified)) : <br />}
    </Text>
  );
};
