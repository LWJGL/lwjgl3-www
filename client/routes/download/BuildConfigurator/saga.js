import { takeLatest, delay } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'

import { DOWNLOAD_INIT } from './actionTypes'
import { downloadLog as log } from './actions'

async function fetchManifest(path) {
  let response;

  try {
    response = await fetch(`/bin/${path}`);
    if ( response.status !== 200 ) {
      return {error: response.statusText};
    }
    return {
      payload: await response.json()
    };
  } catch (e) {
    return {error: e.message};
  }
}

const getBuild = state => {
  let path;
  const build = state.build.build;
  const platformCount = state.build.natives.allIds.length;
  const selectedPlatforms = state.build.platform;

  if ( build === 'release' ) {
    path = `release/${state.build.version}`;
  } else {
    path = build;
  }

  const selected = state.build.artifacts.allIds.filter(artifact => {
    if ( state.build.contents[artifact] === false ) {
      return false;
    }

    const spec = state.build.artifacts.byId[artifact];

    return spec.natives === undefined
      || spec.natives.length === platformCount
      || spec.natives.some(platform => selectedPlatforms[platform]);
  });

  return {
    path,
    selected,
    platforms: selectedPlatforms,
    source: state.build.source,
    javadoc: state.build.javadoc,
  };
};

function getFiles(manifest, selected, platforms, source, javadoc) {
  const files = [];
  const root = manifest[0];  // first entry is root dir
  const rootRegExp = new RegExp(`^${root}`);
  const javaDocRegExp = new RegExp('-javadoc.jar$');
  const sourcesRegExp = new RegExp('-sources.jar$');
  const nativeRegExp = new RegExp('-natives-');
  const platformRegExp = new RegExp('-natives-([a-z]+)\.jar$');

  const selectedMap = {};

  selected.forEach(key => selectedMap[key] = true);

  manifest.forEach(file => {
    const filepath = file.replace(rootRegExp, '');

    if ( filepath.endsWith('/') || !filepath.length ) {
      return;
    }

    if ( filepath.indexOf('/') === -1 ) {
      // Root file, include it in the bundle
      files.push(filepath);
      return;
    }

    const folder = filepath.split('/')[0];

    // Check if binding is selected
    if ( !selectedMap[folder] ) {
      return;
    }

    // Check if javadoc
    if ( filepath.match(javaDocRegExp) !== null && !javadoc ) {
      return;
      // Check if sources are included
    } else if ( filepath.match(sourcesRegExp) !== null && !source ) {
      return;
      // Check if platform is selected
    } else if ( filepath.match(nativeRegExp) ) {
      const platform = filepath.match(platformRegExp);
      if ( platform === null || platforms[platform[1]] === false ) {
        return;
      }
    }

    // Include all the rest
    files.push(filepath);
  });

  return files;
}

async function fetchFile(root, path) {
  const url = `http://build.lwjgl.org.s3.amazonaws.com/${root}${path}`;
  let response;

  try {
    response = await fetch(
      url,
      {
        method: 'GET',
        mode: 'cors',
      }
    );
    if ( response.status !== 200 ) {
      return {error: response.statusText};
    }
    return {
      payload: await response.blob()
    };
  } catch (e) {
    return {error: e.message};
  }
}

function* init() {
  yield put(log('Validating selection'));

  const {path, selected, platforms, source, javadoc} = yield select(getBuild);

  yield delay(100);
  yield put(log('Downloading manifest'));
  const manifest = yield call(fetchManifest, `${path}`);
  if ( manifest.error ) {
    yield put(log(manifest.error));
    return;
  }

  yield delay(100);
  yield put(log('Building file list'));
  const files = yield getFiles(manifest.payload, selected, platforms, source, javadoc);

  yield delay(100);
  yield put(log(`Downloading ${files.length} files`));

  const data = [];

  for ( let i = 0, len = files.length; i < len; i += 1 ) {
    const download = yield call(fetchFile, manifest.payload[0], files[i]);
    if ( download.error ) {
      yield put(log(download.error));
      return;
    }
    yield put(log(`- ${files[i]}`));
  }
}

export default function*() {
  yield* takeLatest(DOWNLOAD_INIT, init);
}
