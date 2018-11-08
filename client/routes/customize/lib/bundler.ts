import * as JSZip from 'jszip';
import { HTTP_OK } from '~/services/http_status_codes';
import {
  Binding,
  BindingDefinition,
  BindingMapSelection,
  BuildStore,
  BuildType,
  Native,
  PlatformSelection,
} from '../types';

type AddonSelection = Array<{ id: string; version: string }>;

interface SelectedBuildConfig {
  path: string;
  selected: Array<Binding>;
  build: BuildType;
  platforms: PlatformSelection;
  source: boolean;
  javadoc: boolean;
  includeJSON: boolean;
  version: string;
  addons: AddonSelection;
}

export function getBuild(state: BuildStore): SelectedBuildConfig {
  let path;
  let _build;
  const platformCount = state.natives.allIds.length;
  const selectedPlatforms = state.platform;

  if (state.build === BuildType.Release) {
    path = `release/${state.version}`;
    _build = BuildType.Release;
  } else if (state.build !== null) {
    _build = state.build;
    path = state.build;
  } else {
    throw new Error('no build selected');
  }

  const selected = state.artifacts.allIds.filter(artifact => {
    if (!state.contents[artifact]) {
      return false;
    }

    const spec = state.artifacts.byId[artifact] as BindingDefinition;

    return (
      spec.natives === undefined ||
      spec.nativesOptional === true ||
      spec.natives.length === platformCount ||
      spec.natives.some(platform => selectedPlatforms[platform])
    );
  });

  const addons = state.selectedAddons.map(addon => ({
    id: addon,
    version: state.addons.byId[addon].maven.version,
  }));

  return {
    path,
    selected,
    build: _build,
    platforms: selectedPlatforms,
    source: state.source,
    javadoc: state.javadoc,
    includeJSON: state.includeJSON,
    version: state.version,
    addons,
  };
}

export async function fetchManifest(path: string): Promise<Array<string>> {
  const response = await fetch(`/bin/${path}`);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }
  return await response.json();
}

export function getFiles(
  path: string,
  manifest: Array<string>,
  selected: Array<Binding>,
  platforms: PlatformSelection,
  source: boolean,
  javadoc: boolean
): Array<string> {
  const files: Array<string> = [];
  const rootRegExp = new RegExp(`^${path}/bin/`);
  const javaDocRegExp = new RegExp('-javadoc.jar$');
  const sourcesRegExp = new RegExp('-sources.jar$');
  const nativeRegExp = new RegExp('-natives-');
  const platformRegExp = new RegExp('-natives-([a-z]+).jar$');

  const selectedMap = {} as BindingMapSelection;

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
    if (!(folder in selectedMap)) {
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
      if (platform === null) {
        return;
      }
      const native = pathToNative(platform[1]);
      if (native === null || platforms[native] !== true) {
        return;
      }
    }

    // Include all the rest
    files.push(filepath);
  });

  return files.map((filepath: string): string => `${path}/bin/${filepath}`);
}

function pathToNative(folder: string): Native | null {
  switch (folder) {
    case 'windows':
      return Native.Windows;
    case 'macos':
      return Native.MacOS;
    case 'linux':
      return Native.Linux;
  }

  return null;
}

export function getAddons(addons: AddonSelection, source: boolean, javadoc: boolean) {
  const files: Array<string> = [];

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

async function fetchFile(path: string, abortSignal?: AbortSignal) {
  const fetchOptions: RequestInit = {
    method: 'GET',
    mode: 'cors',
  };
  if (abortSignal !== undefined) {
    fetchOptions.signal = abortSignal;
  }
  let response = await fetch(`https://build.lwjgl.org/${path}`, fetchOptions);

  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }

  return {
    payload: await response.blob(),
    filename: path.split('/').pop() as string,
  };
}

let abortController: AbortController | null = null;
let abortSignal: boolean = false;

export function abortDownload() {
  abortSignal = true;

  if (abortController !== null) {
    abortController.abort();
  }
}

export function downloadFiles(files: Array<string>, jszip: JSZip, log: (msg: string) => void): Promise<Array<void>> {
  const FILES_TOTAL = files.length;
  const PARALLEL_DOWNLOADS = Math.min(6, FILES_TOTAL);
  const queue: Iterable<string> = files[Symbol.iterator]();
  const channels: Array<Promise<void>> = [];
  let f = 0;
  abortSignal = false;

  if (typeof AbortController !== 'undefined') {
    abortController = new AbortController();
    // abortController.signal.addEventListener('abort', () => {
    //   console.log('AbortController cancelled fetch: ' + this.abortSignal.aborted);
    // });
  }

  for (let i = 0; i < PARALLEL_DOWNLOADS; i += 1) {
    channels.push(
      new Promise(async (resolve, reject) => {
        for (let path of queue) {
          f += 1;
          log(`${f}/${FILES_TOTAL} - ${path}`);
          try {
            if (abortSignal) {
              const err = new Error();
              err.name = 'AbortError';
              throw err;
            }
            const download = await fetchFile(path, abortController !== null ? abortController.signal : undefined);
            jszip.file(download.filename, download.payload, { binary: true });
          } catch (err) {
            reject(err);
            return;
          }
        }
        resolve();
      })
    );
  }

  return Promise.all(channels);
}
