import * as React from 'react';
import { BuildPanel } from './BuildPanel';
import { BuildType } from './types';
import { fields, hasLanguageOption, isBuildRelease, isBuildSelected } from './fields';
import { ControlledPanel } from '~/routes/customize/ControlledPanel';
import { BuildConfigArea } from './BuildConfigArea';
import { ControlledRadio } from './ControlledRadio';
import { ControlledCheckbox } from './ControlledCheckbox';
import { ControlledToggle } from './ControlledToggle';
import { BuildPlatform } from './BuildPlatform';
import { BuildAddons } from './BuildAddons';
import { BuildReleaseNotes } from './BuildReleaseNotes';
import { BuildArtifacts } from './BuildArtifacts';
// import { BuildFooter } from './BuildFooter';

/*
import * as JSZip from 'jszip';

import { ScreenLock } from '~/components/ScreenLock';
import { saveAs } from '~/services/file-saver';
import { abortDownload, downloadFiles, fetchManifest, getAddons, getBuild, getConfig, getFiles } from './bundler';
import { BuildAddon } from './BuildAddon';
import { BuildArtifact } from './BuildArtifact';
import { BuildBundler } from './BuildBundler';
import { BuildConfigArea } from './BuildConfigArea';
import { BuildType } from './BuildType';
import { BUILD_RELEASE, MODE_ZIP } from './constants';
import { configLoad } from './reducer';
// Types
import { BuildConfig, BuildConfigStored } from './types';
*/

export function BuildConfigurator() {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg p-0 px-lg-3">
          <BuildPanel build={BuildType.Release} />
        </div>
        <div className="col-lg p-0">
          <BuildPanel build={BuildType.Stable} />
        </div>
        <div className="col-lg p-0 px-lg-3">
          <BuildPanel build={BuildType.Nightly} />
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
                  <BuildAddons />

                  <ControlledPanel predicate={isBuildRelease}>
                    <h4 className="mt-3">Version</h4>
                    <ControlledRadio spec={fields.version} />
                    <BuildReleaseNotes />
                  </ControlledPanel>
                </div>

                <div className="col-md-6">
                  <h4>Contents</h4>
                  <BuildArtifacts />
                </div>
              </div>
              {/*<BuildFooter />*/}
            </BuildConfigArea>
          </div>
        </div>
      </ControlledPanel>
    </React.Fragment>
  );
}

/*

interface Props {}
interface State {
  isDownloading: boolean;
  progress: Array<string>;
}

export class BuildConfigurator extends React.Component<Props, State> {
  state = {
    isDownloading: false,
    progress: [],
  };

  componentWillUnmount() {
    this.mounted = false;
    this.unsubscribe();
    if (this.state.isDownloading) {
      this.downloadAbort();
    }
  }

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
      </div>
    );
  }
}
*/
