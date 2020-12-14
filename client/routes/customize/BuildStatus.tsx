import type { BuildType } from './types';
import { ResourceCached } from '~/services/Resource';
import { config } from './config';
import { Text } from '~/components/ui/Text';

interface BuildStatusSuccess {
  lastModified: string;
  version?: string;
}

interface BuildStatusError {
  error: string;
}

type BuildStatus = BuildStatusSuccess | BuildStatusError;
const BuildStatusResource = new ResourceCached<BuildType, BuildStatus>(loadStatus);

async function loadStatus(name: BuildType): Promise<BuildStatus> {
  let url = `/build/${name}`;

  if (name === 'release') {
    url += `/${config.versions[0]}`;
  }

  try {
    return await fetchStatus(url);
  } catch (err) {
    return { error: err.message };
  }
}

async function fetchStatus(url: string) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

interface Props {
  name: BuildType;
}

export const BuildStatus = ({ name }: Props) => {
  const status = BuildStatusResource.read(name);

  return (
    <Text size="sm" css={{ color: 'error' in status ? '$critical700' : '$neutral700' }}>
      {'error' in status ? status.error : status.version}
      <br />
      {'lastModified' in status ? status.lastModified : <br />}
    </Text>
  );
};
