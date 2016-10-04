import { takeLatest, delay } from 'redux-saga'
import { call, apply, put, select } from 'redux-saga/effects'

import { DOWNLOAD_INIT } from './actionTypes'
import { downloadLog as log, downloadComplete } from './actions'

import JSZip from 'jszip'
import { saveAs } from 'file-saver'

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
      payload: await response.blob(),
      filename: path.split('/').pop(),
    };
  } catch (e) {
    return {error: e.message};
  }
}

function* init() {

  if ( !JSZip.support.blob ) {
    yield put(downloadComplete(`We're sorry, your browser is not capable of downloading and bundling files.`));
    return;
  }

  const {path, selected, platforms, source, javadoc} = yield select(getBuild);

  yield put(log('Downloading file manifest'));
  const manifest = yield call(fetchManifest, `${path}`);
  if ( manifest.error ) {
    yield put(downloadComplete(manifest.error));
    return;
  }

  yield put(log('Building file list'));
  const files = yield getFiles(manifest.payload, selected, platforms, source, javadoc);

  yield call(delay, 250);
  yield put(log(`Downloading ${files.length} files`));

  const data = [];

  for ( let i = 0, len = files.length; i < len; i += 1 ) {
    const download = yield call(fetchFile, manifest.payload[0], files[i]);
    if ( download.error ) {
      yield put(downloadComplete(download.error));
      return;
    }
    data.push(download);
    yield put(log(`${i+1}/${len} - ${files[i]}`));
  }

  yield put(log(`Compressing files`));
  const zip = new JSZip();

  data.forEach(item => {
    zip.file(item.filename, item.payload, {binary:true});
  });


  const zipOptions = {
    type:'blob',
    // compression:'DEFLATE',
    // compressionOptions: {level:6},
  };

  const blob = yield apply(zip, zip.generateAsync, [zipOptions]);
  saveAs(blob, "lwjgl-custom.zip");

  yield put(log(`Done!`));
  yield call(delay, 500);
  yield put(downloadComplete());
}

export default function*() {
  yield* takeLatest(DOWNLOAD_INIT, init);
}
