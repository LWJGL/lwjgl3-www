import * as React from 'react';
import { useEffect } from 'react';
import { BuildType } from './BuildType';

// Constants
const STORAGE_KEY = 'lwjgl-build-config';
let firstLoad = false;

export function BuildConfigurator() {
  useEffect(() => {
    /*
    if ( firstLoad ) {
      firstLoad = false;
      const restore = localStorage.getItem(STORAGE_KEY);
      if (restore != null) {
        try {
          this.prevSave = JSON.parse(restore);
        } catch (err) {
          localStorage.removeItem(STORAGE_KEY);
        }
        if (this.prevSave !== null) {
          store.dispatch(configLoad(this.prevSave));
        }
      }
    }
    */
  }, []);

  /*
  componentDidMount() {
    this.mounted = true;

    if (BuildConfigurator.firstLoad) {
      // Only restore once, use redux store for subsequent mounts
      BuildConfigurator.firstLoad = false;
      const restore = localStorage.getItem(STORAGE_KEY);
      if (restore != null) {
        try {
          this.prevSave = JSON.parse(restore);
        } catch (err) {
          localStorage.removeItem(STORAGE_KEY);
        }
        if (this.prevSave !== null) {
          store.dispatch(configLoad(this.prevSave));
        }
      }
    }

    this.unsubscribe = store.subscribe(
      debounce(() => {
        const save = getConfig(store.getState());
        if (save === null) {
          if (this.prevSave !== null) {
            this.prevSave = null;
            localStorage.removeItem(STORAGE_KEY);
          }
          return;
        }

        // Save to local storage
        // * NOTE: We deep compare because it is faster than serializing & storing on disk every time
        if (this.prevSave === null || !isEqual(this.prevSave, save)) {
          this.prevSave = save;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
        }
      }, 500)
    );
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unsubscribe();
    if (this.state.isDownloading) {
      this.downloadAbort();
    }
  }
*/
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg p-0 px-lg-3">
          <BuildType build="release" />
        </div>
        <div className="col-lg p-0">
          <BuildType build="stable" />
        </div>
        <div className="col-lg p-0 px-lg-3">
          <BuildType build="nightly" />
        </div>
      </div>
    </React.Fragment>
  );
}

/*
import * as JSZip from 'jszip';
import debounce from 'lodash-es/debounce';
import * as isEqual from 'react-fast-compare';
import { ControlledCheckbox } from '~/components/ControlledCheckbox';
import { ControlledPanel } from '~/components/ControlledPanel';
import { ControlledRadio } from '~/components/ControlledRadio';
import { ControlledToggle } from '~/components/ControlledToggle';
import IconFileDownload from '~/components/icons/md/FileDownload';
import { ScreenLock } from '~/components/ScreenLock';
import { saveAs } from '~/services/file-saver';
import { store } from '~/store';
import { Connect } from '~/store/Connect';
import { abortDownload, downloadFiles, fetchManifest, getAddons, getBuild, getConfig, getFiles } from './bundler';
import { BuildAddon } from './components/BuildAddon';
import { BuildArtifact } from './components/BuildArtifact';
import { BuildBundler } from './components/BuildBundler';
import { BuildConfigArea } from './components/BuildConfigArea';
import { BuildPlatform } from './components/BuildPlatform';
import { BuildScript } from './components/BuildScript';
import { BuildToolbar } from './components/BuildToolbar';
import { BuildType } from './components/BuildType';
import { BUILD_RELEASE, MODE_ZIP } from './constants';
import { fields, hasLanguageOption, isBuildRelease, isBuildSelected } from './fields';
import { configLoad } from './reducer';
// Types
import { BuildConfig, BuildConfigStored } from './types';

interface Props {}
interface State {
  isDownloading: boolean;
  progress: Array<string>;
}

*/

/*
export class BuildConfigurator extends React.Component<Props, State> {
  static firstLoad = true;
  unsubscribe!: () => void;
  prevSave: BuildConfigStored | null = null;
  mounted: boolean = false;

  state = {
    isDownloading: false,
    progress: [],
  };


  configJSONfilename(save: BuildConfigStored) {
    return `lwjgl-${save.build}-${save.preset != null ? save.preset : 'custom'}-${save.mode}.json`;
  }

  configDownload = () => {
    const save = getConfig(store.getState());
    if (save === null) {
      return;
    }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json', endings: 'native' });
    saveAs(blob, this.configJSONfilename(save));
  };

  download = async () => {
    if (!JSZip.support.blob) {
      alert(`We're sorry, your browser is not capable of downloading and bundling files.`);
      return;
    }

    this.setState({
      isDownloading: true,
      progress: ['Downloading file manifest'],
    });

    const snapshot = store.getState();
    const { build, path, selected, platforms, source, javadoc, includeJSON, version, addons } = getBuild(snapshot);

    let manifest;
    try {
      manifest = await fetchManifest(path);
    } catch (err) {
      this.downloadCancel(err.message);
      return;
    }

    let files = getFiles(path, manifest, selected, platforms, source, javadoc);

    if (addons.length) {
      files = files.concat(getAddons(addons, source, javadoc));
    }

    const jszip = new JSZip();

    this.downloadLog(`Downloading ${files.length} files`);
    try {
      await downloadFiles(files, jszip, this.downloadLog.bind(this));
    } catch (err) {
      this.downloadCancel(err.name !== 'AbortError' ? err.message : undefined);
      return;
    }

    // Include JSON Config
    if (includeJSON) {
      const save = getConfig(snapshot);
      if (save !== null) {
        const blob = new Blob([JSON.stringify(save, null, 2)], {
          type: 'application/json',
          endings: 'native',
        });
        jszip.file(this.configJSONfilename(save), blob, { binary: true });
      }
    }

    // Generate ZPI files
    this.downloadLog('Compressing files');
    const blob = await jszip.generateAsync({
      type: 'blob',
      // compression: 'DEFLATE',
      // compressionOptions: {level:6},
    });

    saveAs(
      blob,
      `lwjgl-${build}-${build === BUILD_RELEASE ? version : new Date().toISOString().slice(0, 10)}-custom.zip`
    );

    this.downloadComplete();
  };

  downloadAbort = () => {
    // This will cause an AbortController signal to fire.
    // Firing the signal will reject the fetch promise which will then be caught
    // and downloadCancel(err.message) will fire
    abortDownload();
  };

  downloadCancel(msg?: string) {
    if (this.mounted) {
      this.downloadComplete();
    }
    if (msg !== undefined) {
      alert(msg);
    }
  }

  downloadLog(msg: string) {
    this.setState({
      progress: [...this.state.progress, msg],
    });
  }

  downloadComplete() {
    this.setState({
      isDownloading: false,
      progress: [],
    });
  }

  render() {
    const { isDownloading, progress } = this.state;

    return (
      <div className="config-container" style={{ position: 'relative' }}>
        <ScreenLock isOpen={isDownloading} backdropClassName="dark">
          <div className="container">
            <div className="row">
              <BuildBundler progress={progress} cancel={this.downloadAbort} />
            </div>
          </div>
        </ScreenLock>

        <div className="row">
          <div className="col-lg p-0 px-lg-3">
            <BuildType build="release" />
          </div>
          <div className="col-lg p-0">
            <BuildType build="stable" />
          </div>
          <div className="col-lg p-0 px-lg-3">
            <BuildType build="nightly" />
          </div>
        </div>
        <ControlledPanel predicate={isBuildSelected}>
          <div className="row">
            <div className="col p-0">
              <BuildConfigArea>
                <div className="row pt-3">
                  <div className="col-md">
                    <h4>Mode</h4>
                    <ControlledRadio spec={fields.mode} />

                    <h4 className="mt-3">Options</h4>
                    <div className="custom-controls-stacked">
                      <ControlledToggle spec={fields.descriptions} />
                      <ControlledCheckbox spec={fields.source} />
                      <ControlledCheckbox spec={fields.javadoc} />
                      <ControlledCheckbox spec={fields.includeJSON} />
                      <ControlledToggle spec={fields.hardcoded} />
                      <ControlledToggle spec={fields.compact} />
                      <ControlledToggle spec={fields.osgi} />
                    </div>

                    <BuildPlatform />

                    <ControlledPanel predicate={hasLanguageOption}>
                      <h4 className="mt-3">Language</h4>
                      <ControlledRadio spec={fields.language} />
                    </ControlledPanel>
                  </div>
                  <div className="col-md">
                    <h4>Presets</h4>
                    <ControlledRadio spec={fields.preset} />

                    <h4 className="mt-3">Addons</h4>
                    <Connect
                      state={({ build }: { build: BuildConfig }) => ({
                        addons: build.addons.allIds,
                      })}
                    >
                      {({ addons }) => (
                        <div className="custom-controls-stacked">
                          {addons.map((it: string) => (
                            <BuildAddon key={it} id={it} />
                          ))}
                        </div>
                      )}
                    </Connect>

                    <ControlledPanel predicate={isBuildRelease}>
                      <h4 className="mt-3">Version</h4>
                      <ControlledRadio spec={fields.version} />
                      <Connect
                        state={({ build }: { build: BuildConfig }) => ({
                          version: build.version,
                        })}
                      >
                        {({ version }) => (
                          <p>
                            <a
                              href={`https://github.com/LWJGL/lwjgl3/releases/tag/${version}`}
                              style={{ fontSize: '80%' }}
                            >
                              release notes for {version}
                            </a>
                          </p>
                        )}
                      </Connect>
                    </ControlledPanel>
                  </div>

                  <div className="col-md-6">
                    <h4>Contents</h4>
                    <Connect
                      state={({ build }: { build: BuildConfig }) => ({
                        artifacts: build.artifacts.allIds,
                      })}
                    >
                      {({ artifacts }) => (
                        <div className="custom-controls-stacked">
                          {artifacts.map((it: string) => (
                            <BuildArtifact key={it} id={it} />
                          ))}
                        </div>
                      )}
                    </Connect>
                  </div>
                </div>

                <Connect
                  state={({ build }: { build: BuildConfig }) => ({
                    mode: build.modes.byId[build.mode].id,
                  })}
                >
                  {({ mode }) =>
                    mode === MODE_ZIP ? (
                      <BuildToolbar configDownload={this.configDownload}>
                        <button className="btn btn-success" onClick={this.download}>
                          <IconFileDownload /> DOWNLOAD ZIP
                        </button>
                      </BuildToolbar>
                    ) : (
                      <BuildScript configDownload={this.configDownload} />
                    )
                  }
                </Connect>
              </BuildConfigArea>
            </div>
          </div>
        </ControlledPanel>
      </div>
    );
  }
}
*/
