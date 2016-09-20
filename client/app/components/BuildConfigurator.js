import React from 'react'

import BuildType from './BuildType'
import BuildArtifacts from './BuildArtifacts'
import BuildDownload from './BuildDownload'
import BuildScript from './BuildScript'
import ControlledPanel from './ControlledPanel'
import ControlledRadio from './ControlledRadio'
import ControlledCheckbox from './ControlledCheckbox'
import classnames from 'classnames'

const panelConfig = store => store.build !== null;
const panelLanguage = store => store.mode === 'gradle';
const panelNatives = store => store.mode !== 'zip';
const panelVersion = store => store.build === 'release';
const panelContentsClassName = store => classnames("col-xs-12", {
  "col-lg-3": store.mode !== 'zip',
  "col-lg-5": store.mode === 'zip'
});

const BuildConfigurator = () => (
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
    <ControlledPanel className="row" visible={panelConfig}>
      <div className="col-xs-12">
        <div className="build-config">
          <div className="row">
            <div className="col-xs-12 col-lg-3">
              <h2 className="m-y-1">Mode</h2>
              <ControlledRadio name="mode"/>

              <h2 className="m-b-1">Presets</h2>
              <ControlledRadio name="preset"/>

              <h2 className="m-b-1">Options</h2>
              <ControlledCheckbox name="descriptions"/>
              <ControlledCheckbox name="source"/>
              <ControlledCheckbox name="javadoc"/>
              <ControlledCheckbox name="compact"/>
              <ControlledCheckbox name="hardcoded"/>

              <ControlledPanel visible={panelLanguage}>
                <h2 className="m-b-1">Language</h2>
                <ControlledRadio name="language"/>
              </ControlledPanel>

              <ControlledPanel visible={panelNatives}>
                <h2 className="m-b-1">Natives</h2>
                <ControlledRadio name="natives"/>
              </ControlledPanel>

              <ControlledPanel visible={panelVersion}>
                <h2 className="m-b-1">Version</h2>
                <ControlledRadio name="version"/>
              </ControlledPanel>
            </div>

            <ControlledPanel getClassName={panelContentsClassName}>
              <h2 className="m-y-1">Contents</h2>
              <BuildArtifacts />
            </ControlledPanel>

            <BuildDownload />

            <BuildScript />

          </div>
        </div>
      </div>
    </ControlledPanel>
  </div>
);

export default BuildConfigurator