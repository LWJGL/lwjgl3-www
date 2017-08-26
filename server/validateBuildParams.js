const builds = {
  release: true,
  stable: true,
  nightly: true,
};

module.exports = function validateBuildParams(params, next) {
  if (!builds[params.build]) {
    next(new Error('Invalid build name'));
    return false;
  }

  if (params.build === 'release') {
    if (!params.version) {
      next(new Error('Release version is required'));
      return false;
    }
    if (params.version.split('.').length !== 3) {
      next(new Error('Invalid version. Please use semver format'));
      return false;
    }
  } else {
    if (params.version) {
      next(new Error('Version is only allowed when build type is: Release'));
      return false;
    }
  }

  return true;
};
