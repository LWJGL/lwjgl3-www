import * as JSZip from 'jszip';
import { HTTP_OK } from '~/services/http_status_codes';
import {
  BuildStore,
  BuildStoreSnapshot,
  BuildType,
  Native,
  PlatformSelection,
  Binding,
  BindingDefinition,
} from './types';

type AddonSelection = Array<{ id: string; version: string }>;

interface SelectedBuildConfig {
  path: string;
  selected: Array<string>;
  build: BuildType;
  platforms: PlatformSelection;
  source: boolean;
  javadoc: boolean;
  includeJSON: boolean;
  version: string;
  addons: AddonSelection;
}

function keepChecked(src) {
  // Keep only checked items to avoid phantom selections
  // when new items (bindings,addons,platforms) are added
  return Object.keys(src).filter(key => src[key] === true);
}

export function getConfig(build: BuildStore): BuildStoreSnapshot | null {
  if (build.build === null) {
    return null;
  }

  const save: BuildStoreSnapshot = {
    build: build.build,
    mode: build.mode,
    selectedAddons: build.selectedAddons,
    platform: keepChecked(build.platform) as Array<Native>,
    descriptions: build.descriptions,
    compact: build.compact,
    hardcoded: build.hardcoded,
    javadoc: build.javadoc,
    includeJSON: build.includeJSON,
    source: build.source,
    osgi: build.osgi,
    language: build.language,
  };

  if (build.preset === 'custom') {
    save.contents = keepChecked > build.contents;
  } else {
    save.preset = build.preset;
  }
  if (build.build === BuildType.Release) {
    save.version = build.version;
    save.versionLatest = build.versions[0];
  }

  return save;
}

export async function fetchManifest(path: string) {
  const response = await fetch(`/bin/${path}`);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }
  return await response.json();
}

export function getBuild({ build }: { build: BuildStore }): SelectedBuildConfig {
  let path;
  let _build;
  const platformCount = build.natives.allIds.length;
  const selectedPlatforms = build.platform;

  if (build.build === BuildType.Release) {
    path = `release/${build.version}`;
    _build = BuildType.Release;
  } else if (build.build !== null) {
    _build = build.build;
    path = build.build;
  } else {
    throw new Error('no build selected');
  }

  const selected = build.artifacts.allIds.filter(artifact => {
    if (!build.contents[artifact]) {
      return false;
    }

    const spec = build.artifacts.byId[artifact] as BindingDefinition;

    return (
      spec.natives === undefined ||
      spec.nativesOptional === true ||
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
    build: _build,
    platforms: selectedPlatforms,
    source: build.source,
    javadoc: build.javadoc,
    includeJSON: build.includeJSON,
    version: build.version,
    addons,
  };
}

export function getFiles(
  path: string,
  manifest: Array<string>,
  selected: Array<string>,
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
      if (platform == null) {
        return;
      }
      switch (platform[1]) {
        case 'macos':
        case 'windows':
        case 'linux':
          if (platforms[platform[1]] === false) {
            return;
          }
          break;
        default:
          return;
      }
    }

    // Include all the rest
    files.push(filepath);
  });

  return files.map((filepath: string): string => `${path}/bin/${filepath}`);
}

export function getAddons(addons: AddonSelection, source: boolean, javadoc: boolean) {
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

async function fetchFile(path: string, abortSignal?: AbortSignal) {
  const fetchOptions = {
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
    payload: response.blob(),
    filename: path.split('/').pop(),
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
  const queue: Iterator<string> = files[Symbol.iterator]();
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
