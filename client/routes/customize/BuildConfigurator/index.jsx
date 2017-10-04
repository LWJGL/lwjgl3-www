// @flow
import * as React from 'react';
import { createSelector } from 'reselect';
import debounce from 'lodash/debounce';
import { saveAs } from 'file-saver';

//$FlowFixMe
import areEqual from 'fbjs/lib/areEqual';

import { register } from '~/store/asyncReducers';
import store from '~/store';
import Connect from '~/store/Connect';

import reducer, { configLoad, reset } from './reducer';
import fields, { isDownloading, isBuildRelease, hasLanguageOption, isCustomizing, isBuildSelected } from './fields';
import { MODE_ZIP, BUILD_RELEASE } from './constants';

import ControlledPanel from '~/components/ControlledPanel';
import ControlledRadio from '~/components/ControlledRadio';
import ControlledCheckbox from '~/components/ControlledCheckbox';
import ControlledToggle from '~/components/ControlledToggle';

import BuildConfigArea from './components/BuildConfigArea';
import BuildType from './components/BuildType';
import BuildPlatform from './components/BuildPlatform';
import BuildAddon from './components/BuildAddon';
import BuildArtifact from './components/BuildArtifact';
import BuildScript from './components/BuildScript';
import BuildBundler from './components/BuildBundler';
import BuildToolbar from './components/BuildToolbar';

import IconDownload from 'react-icons/md/file-download';

import type { BuildConfig, BuildConfigStored, NATIVES } from './types';
type Props = {||};

const STORAGE_KEY = 'lwjgl-build-config';

const keepChecked = (src: Object): Array<string> => {
  // Keep only checked items to avoid phantom selections
  // when new items (bindings,addons,platforms) are added
  return Object.keys(src).filter((key: string) => src[key] === true);
};

const getConfig = ({ build }: { build: BuildConfig }): BuildConfigStored | null => {
  if (build.build === null) {
    return null;
  }

  const save: BuildConfigStored = {
    build: build.build,
    mode: build.mode,
    selectedAddons: build.selectedAddons,
    //$FlowFixMe
    platform: keepChecked(build.platform),
    descriptions: build.descriptions,
    compact: build.compact,
    hardcoded: build.hardcoded,
    javadoc: build.javadoc,
    source: build.source,
    osgi: build.osgi,
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

class BuildConfigurator extends React.Component<Props> {
  static firstLoad = true;
  unsubscribe: () => void;
  prevSave: BuildConfigStored | null = null;

  constructor(props: Props) {
    super(props);
    if (BuildConfigurator.firstLoad) {
      register('build', reducer);
      // Only restore once, use redux store for subsequent mounts
      BuildConfigurator.firstLoad = false;
      const restore = localStorage.getItem(STORAGE_KEY);
      if (restore != null) {
        this.prevSave = JSON.parse(restore);
        store.dispatch(configLoad(this.prevSave));
      }
    }
  }

  componentDidMount() {
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
    this.unsubscribe();
    store.dispatch(reset());
  }

  configDownload = () => {
    const save = getConfig(store.getState());
    if (save === null) {
      return;
    }
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json', endings: 'native' });
    saveAs(blob, `lwjgl-${save.build}-${save.preset || 'custom'}-${save.mode}.json`);
  };

  download = () => {};

  render() {
    return (
      <div className="config-container" style={{ position: 'relative' }}>
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
                <ControlledPanel predicate={isCustomizing}>
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
                      )}
                  </Connect>
                </ControlledPanel>

                <ControlledPanel predicate={isDownloading}>
                  <div className="row">
                    <BuildBundler />
                  </div>
                </ControlledPanel>
              </BuildConfigArea>
            </div>
          </div>
        </ControlledPanel>
      </div>
    );
  }
}

export default BuildConfigurator;
