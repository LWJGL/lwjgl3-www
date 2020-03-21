import { useState } from 'react';
import { BuildAddons } from './BuildAddons';
import { BuildArtifacts } from './BuildArtifacts';
import { BuildConfigArea } from './BuildConfigArea';
import { BuildDownloaderSuspense } from './BuildDownloaderSuspense';
import { BuildFooter } from './BuildFooter';
import { BuildPanel } from './BuildPanel';
import { BuildPlatform } from './BuildPlatform';
import { BuildReleaseNotes } from './BuildReleaseNotes';
import { ControlledCheckbox } from './ControlledCheckbox';
import { ControlledPanel } from './ControlledPanel';
import { ControlledRadio } from './ControlledRadio';
import { ControlledToggle } from './ControlledToggle';
import { fields, hasLanguageOption, isBuildRelease, isBuildSelected } from './fields';
import { BuildType } from './types';

export function BuildConfigurator() {
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <>
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
              <BuildFooter setIsDownloading={setIsDownloading} />
            </BuildConfigArea>
          </div>
        </div>
      </ControlledPanel>
      {isDownloading && <BuildDownloaderSuspense setIsDownloading={setIsDownloading} />}
    </>
  );
}
