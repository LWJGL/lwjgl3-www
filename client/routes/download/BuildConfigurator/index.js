import React from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import reducer from './reducer'
import * as $$ from './actions'
import saga from './saga'
import subscribe from '../../../store/subscribe'

import {
  BUILD_RELEASE,
  BUILD_STABLE,
  BUILD_NIGHTLY,
  MODE_ZIP,
  MODE_MAVEN,
  MODE_GRADLE,
} from './constants'

import { IS_SAFARI } from '../../../services/globals'

import ControlledPanel from '../../../components/ControlledPanel'
import ControlledRadio from '../../../components/ControlledRadio'
import ControlledCheckbox from '../../../components/ControlledCheckbox'
import BuildType from './components/BuildType'
import BuildPlatform from './components/BuildPlatform'
import BuildArtifacts from './components/BuildArtifacts'
import BuildDownload from './components/BuildDownload'
import BuildScript from './components/BuildScript'
import BuildBundler from './components/BuildBundler'

const getMode = state => state.build.mode;
const getBuild = state => state.build.build;
const getPreset = state => state.build.preset;
const getLanguage = state => state.build.language;
const getVersion = state => state.build.version;
const isBuildSelected = state => getBuild(state) !== null;
const isModeGradle = state => getMode(state) === MODE_GRADLE;
const isModeMaven = state => getMode(state) === MODE_MAVEN;
const isModeZip = state => getMode(state) === MODE_ZIP;
const isModeNotZip = state => getMode(state) !== MODE_ZIP;
const isBuildRelease = state => getBuild(state) === BUILD_RELEASE;
const isDownloading = state => state.build.downloading;
const isCustomizing = state => !state.build.downloading;

const fields = {
  mode: {
    name: "mode",
    value: getMode,
    action: $$.changeMode,
    options: createSelector(
      state => ({
        modes: state.build.modes,
        build: state.build.build,
        version: state.build.version
      }),
      ({modes, build, version}) => {
        return modes.allIds.map(
          mode => ({
            value: mode,
            label: modes.byId[mode].title,
            disabled: mode !== MODE_ZIP && ( build === BUILD_STABLE || version === '3.0.0' ),
          })
        );
      }
    ),
  },
  preset: {
    name: "preset",
    value: getPreset,
    action: $$.changePreset,
    options: createSelector(
      state => ({
        presets: state.build.presets,
        mode: state.build.mode,
        build: state.build.build,
        version: state.build.version
      }),
      ({presets, mode, build, version}) => presets.allIds.map(
        preset => ({
          value: preset,
          label: presets.byId[preset].title,
          disabled: mode === MODE_ZIP && ( version === '3.0.0' || IS_SAFARI ),
        })
      )
    ),
  },
  language: {
    name: "language",
    value: getLanguage,
    action: $$.changeLanguage,
    options: createSelector(
      state => state.build.languages,
      languages => languages.allIds.map(
        lang => ({
          value: lang,
          label: languages.byId[lang].title,
          disabled: lang !== 'groovy',
        })
      )
    ),
  },
  version: {
    name: "version",
    value: getVersion,
    action: $$.changeVersion,
    options: createSelector(
      state => state.build.versions,
      state => state.build.builds.byId[state.build.build].latest,
      (versions, latest) => versions.allIds.map(
        version => {
          const semver = versions.byId[version].semver;
          return {
            value: version,
            label: version,
            disabled: !(semver[2] * 100 + semver[1] * 10 + semver[0] <= latest[2] * 100 + latest[1] * 10 + latest[0])
          };
        }
      )
    ),
  },
  descriptions: {
    label: "Show descriptions",
    checked: state => state.build.descriptions,
    action: $$.toggleDescriptions,
  },
  source: {
    label: "Include source",
    checked: state => state.build.source || state.build.version === '3.0.0' || IS_SAFARI,
    action: $$.toggleSource,
    hidden: isModeNotZip,
    disabled: state => state.build.version === '3.0.0' || IS_SAFARI,
  },
  javadoc: {
    label: "Include JavaDoc",
    checked: state => state.build.javadoc || state.build.version === '3.0.0' || IS_SAFARI,
    action: $$.toggleJavadoc,
    hidden: isModeNotZip,
    disabled: state => state.build.version === '3.0.0' || IS_SAFARI,
  },
  compact: {
    label: "Compact Mode",
    checked: state => state.build.compact,
    action: $$.toggleCompact,
    hidden: state => !isModeMaven(state),
  },
  hardcoded: {
    label: "Do not use variables",
    checked: state => state.build.hardcoded,
    action: $$.toggleHardcoded,
    hidden: state => isModeZip(state),
  },
};

@subscribe
@connect(null, {reset: $$.reset})
class BuildContainer extends React.Component {

  static reducers = {
    'build': reducer
  };

  static sagas = [saga];

  // constructor(props) {
  //   super(props);
  //   if ( process.env.NODE_ENV !== 'production' && module.hot ) {
  //     module.hot.accept('./reducer', () => {
  //       props.reload('build', reducer);
  //     });
  //   }
  // }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    return (
      <div className="mb-2">
        <div className="row">
          <div className="col-lg-4 col-xs-12">
            <BuildType build="release" />
          </div>
          <div className="col-lg-4 col-xs-12">
            <BuildType build="stable" />
          </div>
          <div className="col-lg-4 col-xs-12">
            <BuildType build="nightly" />
          </div>
        </div>
        <ControlledPanel className="row" predicate={isBuildSelected}>
          <div className="col-xs-12">
            <div className="build-config">
              <ControlledPanel className="row" predicate={isCustomizing}>
                <div className="col-xs-12 col-lg-3">
                  <h2 className="my-1">Mode</h2>
                  <ControlledRadio spec={fields.mode} />

                  <BuildPlatform />

                  <h2 className="mb-1">Presets</h2>
                  <ControlledRadio spec={fields.preset} />

                  <h2 className="mb-1">Options</h2>
                  <div className="custom-controls-stacked clearfix mb-1">
                    <ControlledCheckbox spec={fields.descriptions} />
                    <ControlledCheckbox spec={fields.source} />
                    <ControlledCheckbox spec={fields.javadoc} />
                    <ControlledCheckbox spec={fields.compact} />
                    <ControlledCheckbox spec={fields.hardcoded} />
                  </div>

                  <ControlledPanel predicate={isModeGradle}>
                    <h2 className="mb-1">Language</h2>
                    <ControlledRadio spec={fields.language} />
                  </ControlledPanel>

                  <ControlledPanel predicate={isBuildRelease}>
                    <h2 className="mb-1">Version</h2>
                    <ControlledRadio spec={fields.version} />
                  </ControlledPanel>
                </div>

                <BuildArtifacts />
                <BuildDownload />
                <BuildScript />

              </ControlledPanel>
              <ControlledPanel className="row" predicate={isDownloading}>
                <BuildBundler />
              </ControlledPanel>
            </div>
          </div>
        </ControlledPanel>
      </div>
    );
  }

}

export default BuildContainer
