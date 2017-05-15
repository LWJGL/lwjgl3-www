import { channel, buffers } from 'redux-saga';
import { take, takeLatest, fork, call, apply, put, select } from 'redux-saga/effects';

import { HTTP_OK } from 'services/http_status_codes';
import { BUILD_RELEASE, STORAGE_KEY } from './constants';
import {
  DOWNLOAD_INIT,
  CONFIG_DOWNLOAD,
  SELECT_TYPE,
  SELECT_MODE,
  SELECT_PRESET,
  SELECT_LANGUAGE,
  SELECT_VERSION,
  TOGGLE_DESCRIPTIONS,
  TOGGLE_SOURCE,
  TOGGLE_JAVADOC,
  TOGGLE_COMPACT,
  TOGGLE_HARDCODED,
  TOGGLE_PLATFORM,
  TOGGLE_ARTIFACT,
  TOGGLE_ADDON,
  downloadLog as log,
  downloadComplete,
} from './reducer';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

async function fetchManifest(path) {
  const response = await fetch(`/bin/${path}`);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }
  return await response.json();
}

function getBuild({ build }) {
  let path;
  const platformCount = build.natives.allIds.length;
  const selectedPlatforms = build.platform;

  if (build.build === BUILD_RELEASE) {
    path = `release/${build.version}`;
  } else {
    path = build.build;
  }

  const selected = build.artifacts.allIds.filter(artifact => {
    if (!build.contents[artifact]) {
      return false;
    }

    const spec = build.artifacts.byId[artifact];

    return (
      spec.natives === undefined ||
      spec.natives.length === platformCount ||
      spec.natives.some(platform => selectedPlatforms[platform])
    );
  });

  const addons = build.selectedAddons.map(addon => ({
    id: addon,
    version: build.addons.byId[addon].maven.version,
  }));

  return {
    path,
    selected,
    build: build.build,
    platforms: selectedPlatforms,
    source: build.source,
    javadoc: build.javadoc,
    version: build.version,
    addons,
  };
}

function getFiles(path, manifest, selected, platforms, source, javadoc) {
  const files = [];
  const rootRegExp = new RegExp(`^${path}/bin/`);
  const javaDocRegExp = new RegExp('-javadoc.jar$');
  const sourcesRegExp = new RegExp('-sources.jar$');
  const nativeRegExp = new RegExp('-natives-');
  const platformRegExp = new RegExp('-natives-([a-z]+)\.jar$');

  const selectedMap = {};

  selected.forEach(key => {
    selectedMap[key] = true;
  });

  manifest.forEach(file => {
    const filepath = file.replace(rootRegExp, '');

    if (filepath.endsWith('/') || !filepath.length) {
      return;
    }

    if (filepath.indexOf('/') === -1) {
      // Root file, include it in the bundle
      files.push(filepath);
      return;
    }

    const folder = filepath.split('/')[0];

    // Check if binding is selected
    if (!selectedMap[folder]) {
      return;
    }

    // Check if javadoc
    if (javaDocRegExp.test(filepath) && javadoc === false) {
      return;
      // Check if sources are included
    } else if (sourcesRegExp.test(filepath) && source === false) {
      return;
      // Check if platform is selected
    } else if (nativeRegExp.test(filepath)) {
      const platform = filepath.match(platformRegExp);
      if (platform === null || platforms[platform[1]] === false) {
        return;
      }
    }

    // Include all the rest
    files.push(filepath);
  });

  return files.map(filepath => `${path}/bin/${filepath}`);
}

function getAddons(addons, source, javadoc) {
  const files = [];

  addons.forEach(addon => {
    const { id, version } = addon;

    files.push(`addons/${id}/${id}-${version}.jar`);
    files.push(`addons/${id}/${id}_license.txt`);
    if (javadoc) {
      files.push(`addons/${id}/${id}-${version}-javadoc.jar`);
    }
    if (source) {
      files.push(`addons/${id}/${id}-${version}-sources.jar`);
    }
  });

  return files;
}

async function fetchFile(path) {
  const url = `https://build.lwjgl.org/${path}`;
  let response;

  response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
  });

  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }

  return {
    payload: await response.blob(),
    filename: path.split('/').pop(),
  };
}

class CountDownLatch {
  channel;
  count;

  constructor(count) {
    this.channel = channel(buffers.fixed(1));
    this.count = count;
  }

  countDown = function*() {
    yield put(this.channel, 1);
  };

  await = function*() {
    for (let i = 0; i < this.count; i += 1) {
      yield take(this.channel);
    }
    this.channel.close();
  };
}

function* downloadWorker(input, output, latch, files) {
  try {
    //noinspection InfiniteLoopJS
    while (true) {
      const index = yield take(input);
      yield put(log(`${index + 1}/${files.length} - ${files[index]}`));
      output.push(yield call(fetchFile, files[index]));
    }
  } finally {
    yield latch.countDown();
  }
}

//noinspection FunctionWithMultipleLoopsJS
function* downloadFiles(files) {
  const PARALLEL_DOWNLOADS = Math.min(8, files.length);
  const output = [];
  const input = channel(buffers.fixed(files.length));
  const latch = new CountDownLatch(PARALLEL_DOWNLOADS);

  for (let i = 0; i < PARALLEL_DOWNLOADS; i += 1) {
    yield fork(downloadWorker, input, output, latch, files);
  }

  for (const i of files.keys()) {
    yield put(input, i);
  }
  input.close();

  yield latch.await();

  return output;
}

function* init() {
  if (!JSZip.support.blob) {
    yield put(downloadComplete(`We're sorry, your browser is not capable of downloading and bundling files.`));
    return;
  }

  yield saveConfig();

  const { build, path, selected, platforms, source, javadoc, version, addons } = yield select(getBuild);

  yield put(log('Downloading file manifest'));

  let manifest;
  try {
    manifest = yield call(fetchManifest, path);
  } catch (e) {
    yield put(downloadComplete(e.message));
    return;
  }

  yield put(log('Building file list'));
  let files = getFiles(path, manifest, selected, platforms, source, javadoc);

  if (addons.length) {
    files = files.concat(getAddons(addons, source, javadoc));
  }

  yield put(log(`Downloading ${files.length} files`));

  const zip = new JSZip();
  try {
    const downloads = yield downloadFiles(files);

    downloads.forEach(download => {
      //noinspection JSUnresolvedFunction
      zip.file(download.filename, download.payload, { binary: true });
    });
  } catch (ignore) {
    yield put(downloadComplete('Artifact download failed. Please try again'));
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
  saveAs(blob, `lwjgl-${build}-${build === BUILD_RELEASE ? version : getToday()}-custom.zip`);

  yield put(log(`Done!`));
  yield put(downloadComplete());
}

const getToday = () => {
  const d = new Date();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  return `${d.getFullYear()}-${month > 9 ? month : '0' + month}-${date > 9 ? date : '0' + date}`;
};

const keepChecked = src => {
  // Keep only checked items to avoid phantom selections
  // when new items (bindings,addons,platforms) are added
  return Object.keys(src).filter(key => src[key] === true);
};

const getConfig = ({ build }) => {
  const save = {
    build: build.build,
    mode: build.mode,
    selectedAddons: build.selectedAddons,
    platform: keepChecked(build.platform),
    descriptions: build.descriptions,
    compact: build.compact,
    hardcoded: build.hardcoded,
    javadoc: build.javadoc,
    source: build.source,
    language: build.language,
  };

  if (build.preset === 'custom') {
    save.contents = keepChecked(build.contents);
  } else {
    save.preset = build.preset;
  }
  if (build.build === BUILD_RELEASE) {
    save.version = build.version;
    save.versionLatest = build.versions[0];
  }

  return save;
};

// Used for debouncing
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function* saveConfig() {
  yield call(delay, 500);

  const save = yield select(getConfig);
  if (save.build !== null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } else if (localStorage.getItem(STORAGE_KEY) !== null) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function* downloadConfig() {
  const save = yield select(getConfig);
  const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json', endings: 'native' });
  saveAs(blob, `lwjgl-${save.build}-${save.preset || 'custom'}-${save.mode}.json`);
}

export default function* buildDownloadSaga(): Generator<*, *, *> {
  yield takeLatest(DOWNLOAD_INIT, init);
  yield takeLatest(CONFIG_DOWNLOAD, downloadConfig);
  yield takeLatest(
    [
      SELECT_TYPE,
      SELECT_MODE,
      SELECT_PRESET,
      SELECT_LANGUAGE,
      SELECT_VERSION,
      TOGGLE_DESCRIPTIONS,
      TOGGLE_SOURCE,
      TOGGLE_JAVADOC,
      TOGGLE_COMPACT,
      TOGGLE_HARDCODED,
      TOGGLE_PLATFORM,
      TOGGLE_ARTIFACT,
      TOGGLE_ADDON,
    ],
    saveConfig
  );
}
