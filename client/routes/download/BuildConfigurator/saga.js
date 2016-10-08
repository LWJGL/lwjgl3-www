import { delay, channel, buffers } from 'redux-saga'
import { take, fork, cancel, call, apply, put, select } from 'redux-saga/effects'

import { PAGE_LEAVE } from '../../../store/reducers/redirect'
import { DOWNLOAD_INIT, DOWNLOAD_COMPLETE } from './actionTypes'
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
    version: state.build.version,
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
    if ( javaDocRegExp.test(filepath) && !javadoc ) {
      return;
      // Check if sources are included
    } else if ( sourcesRegExp.test(filepath) && !source ) {
      return;
      // Check if platform is selected
    } else if ( nativeRegExp.test(filepath) ) {
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
  const url = `https://build.lwjgl.org/${root}${path}`;
  let response;

  response = await fetch(
    url,
    {
      method: 'GET',
      mode: 'cors',
    }
  );

  if ( response.status !== 200 ) {
    throw(response.statusText);
  }

  return {
    payload: await response.blob(),
    filename: path.split('/').pop(),
  };
}

function* downloadWorker(input, output, latch, root, files) {
  try {
    //noinspection InfiniteLoopJS
    while ( true ) {
      const index = yield take(input);
      yield put(log(`${index + 1}/${files.length} - ${files[index]}`));
      output.push(yield call(fetchFile, root, files[index]));
    }
  } finally {
    yield put(latch, 1);
  }
}

function* downloadFiles(files, root) {
  const PARALLEL_DOWNLOADS = Math.min(4, files.length);
  const output = [];
  const input = yield call(channel, buffers.fixed(files.length));
  const latch = yield call(channel, buffers.fixed(PARALLEL_DOWNLOADS));

  for ( let i = 0; i < PARALLEL_DOWNLOADS; i += 1 ) {
    yield fork(downloadWorker, input, output, latch, root, files);
  }

  for ( const i of files.keys() ) {
    yield put(input, i);
  }
  input.close();

  for ( let i = 0; i < PARALLEL_DOWNLOADS; i += 1 ) {
    yield take(latch);
  }
  latch.close();

  return output;
}

function* init() {

  if ( !JSZip.support.blob ) {
    yield put(downloadComplete(`We're sorry, your browser is not capable of downloading and bundling files.`));
    return;
  }

  const {path, selected, platforms, source, javadoc, version} = yield select(getBuild);

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

  const zip = new JSZip();
  try {
    const downloads = yield downloadFiles(files, manifest.payload[0]);

    downloads.forEach(download => {
      //noinspection JSUnresolvedFunction
      zip.file(download.filename, download.payload, {binary: true});
    });
  } catch (e) {
    yield put(downloadComplete("Artifact download failed. Please try again"));
    return;
  }

  yield put(log(`Compressing files`));
  const zipOptions = {
    type: 'blob',
    // compression: 'DEFLATE',
    // compressionOptions: {level:6},
  };

  //noinspection JSUnresolvedVariable
  const blob = yield apply(zip, zip.generateAsync, [zipOptions]);
  saveAs(blob, `lwjgl-${version}-custom.zip`);

  yield put(log(`Done!`));
  yield call(delay, 500);
  yield put(downloadComplete());
}

export default function* BuildDownloadSaga() {
  //noinspection InfiniteLoopJS
  while ( true ) {
    yield take(DOWNLOAD_INIT);
    const downloadTask = yield fork(init);

    const action = yield take([PAGE_LEAVE, DOWNLOAD_COMPLETE]);

    if ( action.type === PAGE_LEAVE ) {
      yield cancel(downloadTask);
      yield put(downloadComplete());
    }
  }
}
