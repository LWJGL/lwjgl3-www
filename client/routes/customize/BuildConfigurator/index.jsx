// @flow
import * as React from 'react';
import { createSelector } from 'reselect';
import { debounce } from 'lodash-es';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import areEqual from 'fbjs/lib/areEqual';

import { store } from '~/store';
import { Connect } from '~/store/Connect';

import { configLoad } from './reducer';
import { fields, isBuildRelease, hasLanguageOption, isBuildSelected } from './fields';
import { getConfig, fetchManifest, getBuild, getFiles, getAddons, downloadFiles, abortDownload } from './bundler';
import { MODE_ZIP, BUILD_RELEASE } from './constants';

import { ControlledPanel } from '~/components/ControlledPanel';
import { ControlledRadio } from '~/components/ControlledRadio';
import { ControlledCheckbox } from '~/components/ControlledCheckbox';
import { ControlledToggle } from '~/components/ControlledToggle';
import { ScreenLock } from '~/components/ScreenLock';

import { BuildConfigArea } from './components/BuildConfigArea';
import { BuildType } from './components/BuildType';
import { BuildPlatform } from './components/BuildPlatform';
import { BuildAddon } from './components/BuildAddon';
import { BuildArtifact } from './components/BuildArtifact';
import { BuildScript } from './components/BuildScript';
import { BuildBundler } from './components/BuildBundler';
import { BuildToolbar } from './components/BuildToolbar';

import IconDownload from 'react-icons/md/file-download';

import type { BuildConfig, BuildConfigStored } from './types';
import type { GenerateOptions } from 'jszip';

const STORAGE_KEY = 'lwjgl-build-config';

type Props = {||};

type State = {
  isDownloading: boolean,
  progress: Array<string>,
};

export class BuildConfigurator extends React.Component<Props, State> {
  static firstLoad = true;
  unsubscribe: Function;
  prevSave: BuildConfigStored | null = null;
  mounted: boolean = false;

  state = {
    isDownloading: false,
    progress: [],
  };

  componentDidMount() {
    this.mounted = true;

    if (BuildConfigurator.firstLoad) {
      // Only restore once, use redux store for subsequent mounts
      BuildConfigurator.firstLoad = false;
      const restore = localStorage.getItem(STORAGE_KEY);
      if (restore != null) {
        this.prevSave = JSON.parse(restore);
        store.dispatch(configLoad(this.prevSave));
      }
    }

    this.unsubscribe = store.subscribe(
      debounce(() => {
        const save = getConfig(store.getState());
        if (save !== null) {
          if (this.prevSave === null || !areEqual(this.prevSave, save)) {
            this.prevSave = save;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
          }
        } else if (this.prevSave !== null) {
          this.prevSave = null;
          localStorage.removeItem(STORAGE_KEY);
        }
      }, 500)
    );
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unsubscribe();
    if (this.state.isDownloading) {
      this.downloadCancel();
    }
  }

  abortController: AbortController | null = null;
  abortSignal: AbortSignal | null = null;

  configDownload = this.configDownload.bind(this);
  configDownload() {
    const save = getConfig(store.getState());
    if (save === null) {
      return;
    }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json', endings: 'native' });
    saveAs(blob, `lwjgl-${save.build}-${save.preset != null ? save.preset : 'custom'}-${save.mode}.json`);
  }

  download = this.download.bind(this);
  async download() {
    if (!JSZip.support.blob) {
      alert(`We're sorry, your browser is not capable of downloading and bundling files.`);
      return;
    }

    if (window.AbortController !== undefined) {
      this.abortController = new AbortController();
      this.abortSignal = this.abortController.signal;
      // this.abortSignal.addEventListener('abort', () => {
      //   console.log('AbortController cancelled fetch: ' + this.abortSignal.aborted);
      // });
    }

    this.setState({
      isDownloading: true,
      progress: ['Downloading file manifest'],
    });

    const { build, path, selected, platforms, source, javadoc, version, addons } = getBuild(store.getState());

    let manifest;
    try {
      manifest = await fetchManifest(path);
    } catch (e) {
      this.downloadCancel(e.message);
      return;
    }

    let files = getFiles(path, manifest, selected, platforms, source, javadoc);

    if (addons.length) {
      files = files.concat(getAddons(addons, source, javadoc));
    }

    this.downloadLog(`Downloading ${files.length} files`);

    const zip = new JSZip();
    try {
      await downloadFiles(files, zip, this.downloadLog.bind(this), this.abortSignal);
    } catch (err) {
      if (err.message !== 'Aborted') {
        this.downloadCancel(err.message);
      }
      return;
    }

    this.downloadLog('Compressing files');

    const blob = await zip.generateAsync({
      type: 'blob',
      // compression: 'DEFLATE',
      // compressionOptions: {level:6},
    });

    saveAs(
      blob,
      `lwjgl-${build}-${build === BUILD_RELEASE ? version : new Date().toISOString().slice(0, 10)}-custom.zip`
    );

    this.downloadComplete();
  }

  downloadAbort = this.downloadAbort.bind(this);
  downloadAbort(e: SyntheticEvent<HTMLButtonElement>) {
    this.downloadCancel();
  }

  downloadCancel(msg: ?string) {
    abortDownload();
    if (this.abortController !== null) {
      this.abortController.abort();
    }
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
                          {addons.map(it => <BuildAddon key={it} id={it} />)}
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
                          {artifacts.map(it => <BuildArtifact key={it} id={it} />)}
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
                          <IconDownload /> DOWNLOAD ZIP
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
