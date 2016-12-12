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
  MODE_ZIP,
  MODE_MAVEN,
  MODE_GRADLE,
  STORAGE_KEY,
} from './constants'

import { IS_SAFARI } from '../../../services/globals'

import ControlledPanel from '../../../components/ControlledPanel'
import ControlledRadio from '../../../components/ControlledRadio'
import ControlledCheckbox from '../../../components/ControlledCheckbox'
import ControlledToggle from '../../../components/ControlledToggle'

import BuildConfigArea from './components/BuildConfigArea'
import BuildType from './components/BuildType'
import BuildPlatform from './components/BuildPlatform'
import BuildAddons from './components/BuildAddons'
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
      state => state.build.modes,
      state => state.build.build,
      state => state.build.version,
      (modes, build, version) => {
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
      state => state.build.presets,
      state => state.build.mode,
      state => state.build.build,
      state => state.build.version,
      (presets, mode, build, version) => presets.allIds.map(
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
      (versions) => versions.allIds.map(
        version => {
          return {
            value: version,
            label: version,
          };
        }
      )
    ),
  },
  descriptions: {
    label: "Show descriptions",
    checked: state => state.build.descriptions,
    action: $$.toggleDescriptions
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
@connect(
  null,
  {
    reset: $$.reset,
    configSave: $$.configSave,
    configLoad: $$.configLoad
  }
)
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

  componentDidMount() {
    const restore = localStorage.getItem(STORAGE_KEY);
    if ( restore !== null ) {
      this.props.configLoad(restore);
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    return (
      <div className="mb-3 config-container">
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
            <BuildConfigArea>

              <ControlledPanel className="pt-1" predicate={isCustomizing}>
                <div className="row">
                  <div className="col-xs-12 col-md-3">
                    <h4>Mode</h4>
                    <ControlledRadio spec={fields.mode} />

                    <h4 className="mb-1">Options</h4>
                    <div className="custom-controls-stacked clearfix mb-1">
                      <ControlledToggle spec={fields.descriptions} />
                      <ControlledCheckbox spec={fields.source} />
                      <ControlledCheckbox spec={fields.javadoc} />
                      <ControlledToggle spec={fields.hardcoded} />
                      <ControlledToggle spec={fields.compact} />
                    </div>

                    <BuildPlatform />

                    <ControlledPanel predicate={isModeGradle}>
                      <h4 className="mb-1">Language</h4>
                      <ControlledRadio spec={fields.language} />
                    </ControlledPanel>

                  </div>
                  <div className="col-xs-12 col-md-3">
                    <h4>Presets</h4>
                    <ControlledRadio spec={fields.preset} />

                    <h4>Addons</h4>
                    <BuildAddons />

                    <ControlledPanel predicate={isBuildRelease}>
                      <h4 className="mt-1">Version</h4>
                      <ControlledRadio spec={fields.version} />
                    </ControlledPanel>
                  </div>

                  <div className="col-xs-12 col-md-6">
                    <h4>Contents</h4>
                    <BuildArtifacts />
                  </div>
                </div>

                <BuildDownload />
                <BuildScript />
              </ControlledPanel>

              <ControlledPanel className="row" predicate={isDownloading}>
                <BuildBundler />
              </ControlledPanel>

            </BuildConfigArea>
          </div>
        </ControlledPanel>
      </div>
    );
  }

}

export default BuildContainer
