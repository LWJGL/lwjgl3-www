import React from 'react'
import classnames from 'classnames'
import {createSelector} from 'reselect'

import * as $$ from './actions'
import {
  BUILD_RELEASE,
  BUILD_NIGHTLY,
  MODE_ZIP,
  MODE_MAVEN,
  MODE_GRADLE,
} from './constants'

import BuildType from './components/BuildType'
import ControlledPanel from '../../components/ControlledPanel'
import BuildArtifacts from './components/BuildArtifacts'
// import BuildDownload from './BuildDownload'
// import BuildScript from './BuildScript'
// import ControlledPanel from '../../components/ControlledPanel'
import ControlledRadio from '../../components/ControlledRadio'
// import ControlledAlert from '../../components/ControlledAlert'
import ControlledCheckbox from '../../components/ControlledCheckbox'

const getMode = state => state.build.mode;
const getBuild = state => state.build.build;
const getPreset = state => state.build.preset;
const getLanguage = state => state.build.language;
const getVersion = state => state.build.version;
const getPlatform = state => state.build.platform;
const isBuildSelected = state => getBuild(state) !== null;
const isModeGradle = state => getMode(state) === MODE_GRADLE;
const isModeMaven = state => getMode(state) === MODE_MAVEN;
const isModeZip = state => getMode(state) === MODE_ZIP;
const isModeNotZip = state => getMode(state) !== MODE_ZIP;
const isBuildRelease = state => getBuild(state) === BUILD_RELEASE;
const getContentsClass = state => {
  const isZip = isModeZip(state);
  return classnames(
    "col-xs-12",
    {
      "col-lg-3": !isZip,
      "col-lg-5": isZip
    }
  )
};

const fields = {
  mode: {
    name: "mode",
    value: getMode,
    action: $$.changeMode,
    options: createSelector(
      state => state.build.modes,
      state => state.build.build,
      (modes, build) => modes.allIds.map(
        mode => ({
          value: mode,
          label: modes.byId[mode].title,
          disabled: mode !== MODE_ZIP && build !== BUILD_NIGHTLY
        })
      )
    ),
  },
  preset: {
    name: "preset",
    value: getPreset,
    action: $$.changePreset,
    options: createSelector(
      state => state.build.presets,
      presets => presets.allIds.map(
        preset => ({
          value: preset,
          label: presets.byId[preset].title
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
          disabled: lang !== 'groovy'
        })
      )
    ),
  },
  natives: {
    name: "natives",
    value: getPlatform,
    action: $$.changePlatform,
    options: createSelector(
      state => state.build.natives,
      natives => natives.allIds.map(
        platform => ({
          value: platform,
          label: natives.byId[platform].title
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
      versions => versions.allIds.map(
        version => ({
          value: version,
          label: version
        })
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
    checked: state => state.build.source,
    action: $$.toggleSource,
    hidden: isModeNotZip,
  },
  javadoc: {
    label: "Include JavaDoc",
    checked: state => state.build.javadoc,
    action: $$.toggleJavadoc,
    hidden: isModeNotZip,
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

const BuildContainer = props => (
  <div>
    {/*<ControlledAlert selector={state => state.build.error} reset={$$.errorReset} />*/}
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
          <div className="row">
            <div className="col-xs-12 col-lg-3">
              <h2 className="m-y-1">Mode</h2>
              <ControlledRadio spec={fields.mode} />

              <h2 className="m-b-1">Presets</h2>
              <ControlledRadio spec={fields.preset} />

              <h2 className="m-b-1">Options</h2>
              <ControlledCheckbox spec={fields.descriptions} />
              <ControlledCheckbox spec={fields.source} />
              <ControlledCheckbox spec={fields.javadoc} />
              <ControlledCheckbox spec={fields.compact} />
              <ControlledCheckbox spec={fields.hardcoded} />

              <ControlledPanel predicate={isModeGradle}>
                <h2 className="m-b-1">Language</h2>
                <ControlledRadio spec={fields.language} />
              </ControlledPanel>

              <ControlledPanel predicate={isModeNotZip}>
                <h2 className="m-b-1">Natives</h2>
                <ControlledRadio spec={fields.natives} />
              </ControlledPanel>

              <ControlledPanel predicate={isBuildRelease}>
                <h2 className="m-b-1">Version</h2>
                <ControlledRadio spec={fields.version} />
              </ControlledPanel>
            </div>

            <ControlledPanel getClassName={getContentsClass}>
              <h2 className="m-y-1">Contents</h2>
              <BuildArtifacts />
            </ControlledPanel>

            {/*<BuildDownload />*/}

            {/*<BuildScript />*/}

          </div>
        </div>
      </div>
    </ControlledPanel>
  </div>
);

export default BuildContainer
