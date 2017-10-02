// @flow
import * as React from 'react';
import { createSelector } from 'reselect';
import { register } from '~/store/asyncReducers';
import store from '~/store';

import {
  default as reducer,
  reset,
  configLoad,
  changePreset,
  changeLanguage,
  changeVersion,
  toggleHardcoded,
  toggleCompact,
  toggleJavadoc,
  toggleOSGi,
  toggleDescriptions,
  toggleSource,
  changeMode,
} from './reducer';

import type { Task } from 'redux-saga';
import reduxSaga from '~/store/saga';
import saga from './saga';

import { BUILD_RELEASE, BUILD_STABLE, MODE_ZIP, MODE_MAVEN, MODE_GRADLE, MODE_IVY, STORAGE_KEY } from './constants';

import ControlledPanel from '~/components/ControlledPanel';
import ControlledRadio from '~/components/ControlledRadio';
import ControlledCheckbox from '~/components/ControlledCheckbox';
import ControlledToggle from '~/components/ControlledToggle';

import BuildConfigArea from './components/BuildConfigArea';
import BuildType from './components/BuildType';
import BuildPlatform from './components/BuildPlatform';
import BuildAddons from './components/BuildAddons';
import BuildArtifacts from './components/BuildArtifacts';
import BuildDownload from './components/BuildDownload';
import BuildScript from './components/BuildScript';
import BuildBundler from './components/BuildBundler';
import BuildReleaseNotes from './components/BuildReleaseNotes';

register('build', reducer);

const getMode = state => state.build.mode;
const getBuild = state => state.build.build;
const getPreset = state => state.build.preset;
const getLanguage = state => state.build.language;
const getVersion = state => state.build.version;
const isBuildSelected = state => getBuild(state) !== null;
const hasLanguageOption = state => getMode(state) === MODE_GRADLE;
const hasCompactModeOption = state => getMode(state) === MODE_MAVEN || getMode(state) === MODE_IVY;
const isModeZip = state => getMode(state) === MODE_ZIP;
const isModeNotZip = state => getMode(state) !== MODE_ZIP;
const isBuildRelease = state => getBuild(state) === BUILD_RELEASE;
const isDownloading = state => state.build.downloading;
const isCustomizing = state => !state.build.downloading;
const showOSGi = state =>
  isModeNotZip(state) && isBuildRelease(state) && parseInt(getVersion(state).replace(/\./g, ''), 10) >= 312;

const fields = {
  mode: {
    name: 'mode',
    value: getMode,
    action: changeMode,
    options: createSelector(
      state => state.build.modes,
      state => state.build.build,
      (modes, build) => {
        return modes.allIds.map(mode => ({
          value: mode,
          label: modes.byId[mode].title,
          disabled: build === BUILD_STABLE && mode !== MODE_ZIP,
        }));
      }
    ),
  },
  preset: {
    name: 'preset',
    value: getPreset,
    action: changePreset,
    options: createSelector(
      state => state.build.presets,
      presets =>
        presets.allIds.map(preset => ({
          value: preset,
          label: presets.byId[preset].title,
        }))
    ),
  },
  language: {
    name: 'language',
    value: getLanguage,
    action: changeLanguage,
    options: createSelector(
      state => state.build.languages,
      languages =>
        languages.allIds.map(lang => ({
          value: lang,
          label: languages.byId[lang].title,
          disabled: lang !== 'groovy',
        }))
    ),
  },
  version: {
    name: 'version',
    value: getVersion,
    action: changeVersion,
    options: createSelector(
      state => state.build.versions,
      versions =>
        versions.map(version => {
          return {
            value: version,
            label: version,
            disabled: version === '3.0.0',
          };
        })
    ),
  },
  descriptions: {
    label: 'Show descriptions',
    checked: state => state.build.descriptions,
    action: toggleDescriptions,
  },
  source: {
    label: 'Include source',
    checked: state => state.build.source,
    action: toggleSource,
    hidden: isModeNotZip,
  },
  javadoc: {
    label: 'Include JavaDoc',
    checked: state => state.build.javadoc,
    action: toggleJavadoc,
    hidden: isModeNotZip,
  },
  osgi: {
    label: 'OSGi Mode',
    checked: state => state.build.osgi,
    action: toggleOSGi,
    hidden: state => !showOSGi(state),
  },
  compact: {
    label: 'Compact Mode',
    checked: state => state.build.compact,
    action: toggleCompact,
    hidden: state => !hasCompactModeOption(state),
  },
  hardcoded: {
    label: 'Do not use variables',
    checked: state => state.build.hardcoded,
    action: toggleHardcoded,
    hidden: state => isModeZip(state),
  },
};

class BuildConfigurator extends React.Component<{||}> {
  restoreState = true;
  sagaTask: Task;

  componentDidMount() {
    this.sagaTask = reduxSaga.run(saga);

    if (this.restoreState) {
      this.restoreState = false;
      const restore = localStorage.getItem(STORAGE_KEY);
      if (restore != null) {
        store.dispatch(configLoad(JSON.parse(restore)));
      }
    }
  }

  componentWillUnmount() {
    this.sagaTask.cancel();
    store.dispatch(reset());
  }

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

                  <BuildDownload />
                  <BuildScript />
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
