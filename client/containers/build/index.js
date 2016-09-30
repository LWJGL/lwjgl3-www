import React from 'react'
import classnames from 'classnames'

import BuildType from './components/BuildType'
import Panel from '../../components/Panel'
// import BuildArtifacts from './BuildArtifacts'
// import BuildDownload from './BuildDownload'
// import BuildScript from './BuildScript'
// import ControlledPanel from '../../components/ControlledPanel'
// import ControlledRadio from '../../components/ControlledRadio'
import ControlledAlert from '../../components/ControlledAlert'
import ControlledCheckbox from '../../components/ControlledCheckbox'

const isBuildSelected = state => state.build.build !== null;
const isModeGradle = state => state.build.mode === 'gradle';
const isModeNotZip = state => state.build.mode !== 'zip';
const isBuildRelease = state => state.build.buildType === 'release';
const getContentsClass = state => classnames(
    "col-xs-12",
  {
    "col-lg-3": state.build.mode !== 'zip',
    "col-lg-5": state.build.mode === 'zip'
  }
);

import * as $$ from './actions'

const fields = {
  descriptions: {
    label: "Show descriptions",
    checked: state => state.build.descriptions,
    action: $$.toggleDescriptions,
  },
  source: {
    label: "Include source",
    checked: state => state.build.source,
    action: $$.toggleSource,
    hidden: isModeNotZip
  },
  javadoc: {
    label: "Include JavaDoc",
    checked: state => state.build.javadoc,
    action: $$.toggleJavadoc,
    hidden: isModeNotZip
  },
  compact: {
    label: "Compact Mode",
    checked: state => state.build.compact,
    action: $$.toggleCompact,
    hidden: state => state.build.mode !== 'maven'
  },
  hardcoded: {
    label: "Do not use variables",
    checked: state => state.build.hardcoded,
    action: $$.toggleHardcoded,
    hidden: state => state.build.mode === 'zip'
  },
};

const BuildContainer = props => (
  <div>

    <ControlledAlert
      selector={state => state.build.error}
      reset={$$.errorReset}
    />

    <div className="row">
      <div className="col-lg-4 col-xs-12">
        <BuildType build="release"/>
      </div>
      <div className="col-lg-4 col-xs-12">
        <BuildType build="stable"/>
      </div>
      <div className="col-lg-4 col-xs-12">
        <BuildType build="nightly"/>
      </div>
    </div>
    <Panel className="row" predicate={isBuildSelected}>
      <div className="col-xs-12">
        <div className="build-config">
          <div className="row">
            <div className="col-xs-12 col-lg-3">
              <h2 className="m-y-1">Mode</h2>
              {/*<ControlledRadio name="mode" />*/}

              <h2 className="m-b-1">Presets</h2>
              {/*<ControlledRadio name="preset"/>*/}

              <h2 className="m-b-1">Options</h2>
              <ControlledCheckbox spec={fields.descriptions}/>
              <ControlledCheckbox spec={fields.source}/>
              <ControlledCheckbox spec={fields.javadoc}/>
              <ControlledCheckbox spec={fields.compact}/>
              <ControlledCheckbox spec={fields.hardcoded}/>

              <Panel predicate={isModeGradle}>
                <h2 className="m-b-1">Language</h2>
                {/*<ControlledRadio name="language"/>*/}
              </Panel>

              <Panel predicate={isModeNotZip}>
                <h2 className="m-b-1">Natives</h2>
                {/*<ControlledRadio name="natives"/>*/}
              </Panel>

              <Panel predicate={isBuildRelease}>
                <h2 className="m-b-1">Version</h2>
                {/*<ControlledRadio name="version"/>*/}
              </Panel>
            </div>

            <Panel getClassName={getContentsClass}>
              <h2 className="m-y-1">Contents</h2>
              {/*<BuildArtifacts />*/}
            </Panel>

            {/*<BuildDownload />*/}

            {/*<BuildScript />*/}

          </div>
        </div>
      </div>
    </Panel>
  </div>
);

export default BuildContainer
