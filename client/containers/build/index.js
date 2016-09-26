import React from 'react'
import classnames from 'classnames'

import BuildType from './components/BuildType'
import Panel from '../../components/Panel'
// import BuildArtifacts from './BuildArtifacts'
// import BuildDownload from './BuildDownload'
// import BuildScript from './BuildScript'
// import ControlledPanel from '../../components/ControlledPanel'
// import ControlledRadio from '../../components/ControlledRadio'
// import ControlledCheckbox from '../../components/ControlledCheckbox'

const isBuildSelected = state => state.build.build !== null;
const isModeGradle = state => state.build.mode === 'gradle';
const isModeNotZip = state => state.build.mode !== 'zip';
const isBuildRelease = state => state.build.buildType === 'release';
const getContentsClass = state => classnames("col-xs-12", {
    "col-lg-3": state.build.mode !== 'zip',
    "col-lg-5": state.build.mode === 'zip'
  });

const BuildContainer = props => (
  <div>
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
              {/*<ControlledCheckbox name="descriptions"/>*/}
              {/*<ControlledCheckbox name="source"/>*/}
              {/*<ControlledCheckbox name="javadoc"/>*/}
              {/*<ControlledCheckbox name="compact"/>*/}
              {/*<ControlledCheckbox name="hardcoded"/>*/}

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
