import JSZip from 'jszip';
import { StatusCode, getResponseError } from '~/services/http';
import { Native, BuildType } from '../types';
import { saveAs } from '~/services/file-saver';
import { configJSONfilename, getConfigSnapshot } from '../config';

import type { Binding, BindingDefinition, BindingMapSelection, BuildStore, PlatformSelection } from '../types';

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

  const selected = state.artifacts.allIds.filter((artifact) => {
    if (!state.contents[artifact]) {
      return false;
    }

    const spec = state.artifacts.byId[artifact] as BindingDefinition;

    return (
      spec.natives === undefined ||
      spec.nativesOptional === true ||
      spec.natives.length === platformCount ||
      spec.natives.some((platform) => selectedPlatforms[platform])
    );
  });

  const addons = state.selectedAddons.map((addon) => ({
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

export const fetchManifest = async (path: string): Promise<Array<string>> => {
  const response = await fetch(`/bin/${path}`, {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'omit',
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.status !== StatusCode.OK) {
    throw new Error(await getResponseError(response));
  }

  return await response.json();
};

export function getFiles(
  path: string,
  manifest: Array<string>,
  selected: Array<Binding>,
  platforms: PlatformSelection,
  source: boolean,
  javadoc: boolean,
): Array<string> {
  const files: Array<string> = [];
  const rootRegExp = new RegExp(`^${path}/bin/`);
  const javaDocRegExp = /-javadoc\.jar$/;
  const sourcesRegExp = /-sources\.jar$/;
  const nativeRegExp = /-natives-/;
  const platformRegExp = /-natives-(\w+(?:-\w+)*)\.jar$/;

  const selectedMap = {} as BindingMapSelection;

  selected.forEach((key) => {
    selectedMap[key] = true;
  });

  // TODO: Ensure the manifest isn't missing any of the selected bindings.
  //       If that happens, there's a bug somewhere (either in lwjgl3-www or in lwjgl3's build process).
  manifest.forEach((file) => {
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
    case 'linux':
      return Native.Linux;
    case 'linux-arm64':
      return Native.LinuxARM64;
    case 'linux-arm32':
      return Native.LinuxARM32;
    case 'linux-ppc64le':
      return Native.LinuxPPC64LE;
    case 'linux-riscv64':
      return Native.LinuxRISCV64;
    case 'macos':
      return Native.MacOS;
    case 'macos-arm64':
      return Native.MacOSARM64;
    case 'windows':
      return Native.Windows;
    case 'windows-x86':
      return Native.WindowsX86;
    case 'windows-arm64':
      return Native.WindowsARM64;
  }

  return null;
}

export function getAddons(addons: AddonSelection, source: boolean, javadoc: boolean) {
  const files: Array<string> = [];

  addons.forEach((addon) => {
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
    credentials: 'omit',
  };
  if (abortSignal !== undefined) {
    fetchOptions.signal = abortSignal;
  }
  let response = await fetch(`https://build.lwjgl.org/${path}`, fetchOptions);

  if (response.status !== StatusCode.OK) {
    throw new Error(await getResponseError(response));
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
  const FILES_TOTAL: number = files.length;
  const PARALLEL_DOWNLOADS: number = Math.min(6, FILES_TOTAL);
  const queue: IterableIterator<string> = files.values();
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
      }),
    );
  }

  return Promise.all(channels);
}

export async function beginDownload(
  usingNetworkRef: React.MutableRefObject<boolean>,
  store: BuildStore,
  downloadCancel: (msg?: string) => void,
  downloadLog: (msg: string) => void,
  downloadComplete: () => void,
) {
  // Fetch all data that we will need from the store
  const { build, path, selected, platforms, source, javadoc, includeJSON, version, addons } = getBuild(store);

  downloadLog('Downloading file manifest');

  // Download latest manifest
  let manifest: Array<string>;
  try {
    manifest = await fetchManifest(path);
  } catch (err) {
    downloadCancel(err.message);
    return;
  }

  let files = getFiles(path, manifest, selected, platforms, source, javadoc);

  if (addons.length) {
    files = files.concat(getAddons(addons, source, javadoc));
  }

  const jszip = new JSZip();

  downloadLog(`Downloading ${files.length} files`);
  try {
    usingNetworkRef.current = true;
    await downloadFiles(files, jszip, downloadLog);
    usingNetworkRef.current = false;
  } catch (err) {
    downloadCancel(err.name !== 'AbortError' ? err.message : undefined);
    return;
  }

  // Include JSON Config
  if (includeJSON) {
    const save = getConfigSnapshot(store);
    if (save !== null) {
      const blob = new Blob([JSON.stringify(save, null, 2)], {
        type: 'application/json',
        endings: 'native',
      });
      jszip.file(configJSONfilename(save), blob, { binary: true });
    }
  }

  // Generate ZIP files
  downloadLog('Compressing files');
  const blob = await jszip.generateAsync({
    type: 'blob',
    // compression: 'DEFLATE',
    // compressionOptions: {level:6},
  });

  saveAs(
    blob,
    `lwjgl-${build}-${build === BuildType.Release ? version : new Date().toISOString().slice(0, 10)}-custom.zip`,
  );

  downloadComplete();
}
