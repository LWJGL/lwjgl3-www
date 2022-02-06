import { s3 } from '../AWS.mjs';

const builds = {
  release: true,
  stable: true,
  nightly: true,
};

export default async params => {
  if (!builds[params.build]) {
    throw new Error('Invalid build name');
  }

  if (params.build === 'release') {
    if (!params.version) {
      throw new Error('Release version is required');
    }
    if (params.version.split('.').length !== 3) {
      throw new Error('Invalid version. Please use semver format');
    }
  } else {
    if (params.version) {
      throw new Error('Version is only allowed when build type is: Release');
    }
  }

  let data = await s3.listObjectsV2({
    Bucket: 'lwjgl-build',
    FetchOwner: false,
    MaxKeys: 500,
    Prefix: params.build === 'release' ? `${params.build}/${params.version}/bin/` : `${params.build}/bin/`,
  });

  if (!data.Contents) {
    throw new Error('No files found!');
  }

  return data.Contents.map(item => {
    return item.Key;
  });
};
