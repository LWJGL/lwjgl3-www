import React from 'react'
import classnames from 'classnames'
import {observer} from 'mobx-react';
import RadioGroup from './RadioGroup'
import Radio from './Radio'
import Checkbox from './Checkbox'

import BuildStatus from './BuildStatus'
import config from '../../../common/BuildConfig'

@observer
class BuildConfigurator extends React.Component {

  static propTypes = {
    store: React.PropTypes.object.isRequired
  };

  state = {
    store: null
  };

  constructor(props) {
    super(props);
    this.selectBuild = this.selectBuild.bind(this);
    this.selectMode = this.selectMode.bind(this);
    this.selectVersion = this.selectVersion.bind(this);
    this.selectPreset = this.selectPreset.bind(this);
    this.selectLanguage = this.selectLanguage.bind(this);
    this.selectNatives = this.selectNatives.bind(this);
    this.toggleArtifact = this.toggleArtifact.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  selectBuild(e) {
    let build = e.currentTarget.getAttribute('data-build');
    if ( this.props.store.build === build ) {
      build = null;
    }
    this.props.store.selectBuild(build);
  }

  selectMode(value) {
    this.props.store.selectMode(value);
  }

  selectVersion(value) {
    this.props.store.selectVersion(value);
  }

  selectPreset(value) {
    this.props.store.selectPreset(value);
  }

  selectLanguage(value) {
    this.props.store.selectLanguage(value);
  }

  selectNatives(value) {
    this.props.store.selectNatives(value);
  }

  toggleArtifact(value) {
    this.props.store.toggleArtifact(value);
  }

  copyToClipboard() {
    this.refs.script.select();
    document.execCommand('copy');
    this.refs.script.blur();
  }

  render() {
    const store = this.props.store;
    const ZIPDISABLE = store.mode === 'zip';
    const MODEDISABLE = store.build !== 'nightly';
    const ACTIVE = store.build !== null;

    return (
      <div>
        <div className="row">
          <div className="col-lg-4 col-xs-12">
            <div data-build="release" className={classnames('build', 'release', {'selected': store.build === 'release', 'active': ACTIVE})} onClick={this.selectBuild}>
              <h2>Release</h2>
              <p>Latest official release</p>
              <BuildStatus name="lwjgl_Release"/>
            </div>
          </div>
          <div className="col-lg-4 col-xs-12">
            <div data-build="stable" className={classnames('build', 'stable', {'selected': store.build === 'stable', 'active': ACTIVE})} onClick={this.selectBuild}>
              <h2>Stable</h2>
              <p>Beta quality, verified to work</p>
              <BuildStatus name="LwjglReleases_NightlyToStable"/>
            </div>
          </div>
          <div className="col-lg-4 col-xs-12">
            <div data-build="nightly" className={classnames('build', 'nightly', {'selected': store.build === 'nightly', 'active': ACTIVE})} onClick={this.selectBuild}>
              <h2>Nightly</h2>
              <p>Bleeding edge, possibly broken</p>
              <BuildStatus name="lwjgl_Bundle"/>
            </div>
          </div>
        </div>
        <div className="row" style={{display: store.build === null ? 'none' : ''}}>
          <div className="col-xs-12">
            <div className={classnames('build-config')}>
              <div className="row">
                <div className="col-xs-12 col-lg-3">
                  <h2 className="m-y-1">Mode</h2>

                  <RadioGroup name="mode" value={store.mode} onChange={this.selectMode}>
                    <Radio value="zip" label="ZIP Bundle"/>
                    <Radio value="maven" label="Maven" disabled={MODEDISABLE}/>
                    <Radio value="gradle" label="Gradle" disabled={MODEDISABLE}/>
                  </RadioGroup>

                  <h2 className="m-b-1">Presets</h2>
                  <RadioGroup name="preset" value={store.preset} onChange={this.selectPreset}>
                    <Radio value="none" label="None" disabled={ZIPDISABLE}/>
                    <Radio value="all" label="Everything" disabled={ZIPDISABLE}/>
                    <Radio value="getting-started" label="Getting Started" disabled={ZIPDISABLE}/>
                    <Radio value="minimal-opengl" label="Minimal OpenGL" disabled={ZIPDISABLE}/>
                    <Radio value="minimal-opengles" label="Minimal OpenGL ES" disabled={ZIPDISABLE}/>
                    <Radio value="minimal-vulkan" label="Minimal Vulkan" disabled={ZIPDISABLE}/>
                    <Radio value="custom" label="Custom" disabled={ZIPDISABLE}/>
                  </RadioGroup>

                  <h2 className="m-b-1">Options</h2>
                  <Checkbox
                    label="Show descriptions"
                    checked={store.descriptions}
                    onChange={store.toggleDescriptions}
                  />
                  <Checkbox
                    hidden={store.mode !== 'zip'}
                    disabled={ZIPDISABLE}
                    label="Include source"
                    checked={store.source}
                    onChange={store.toggleSource}
                  />
                  <Checkbox
                    hidden={store.mode !== 'zip'}
                    disabled={ZIPDISABLE}
                    label="Include Javadoc"
                    checked={store.javadoc}
                    onChange={store.toggleJavadoc}
                  />
                  <Checkbox
                    hidden={store.mode !== 'maven'}
                    label="Compact Mode"
                    checked={store.compact}
                    onChange={store.toggleCompact}
                  />
                  <Checkbox
                    hidden={store.mode === 'zip'}
                    label="Do not use variables"
                    checked={store.hardcoded}
                    onChange={store.toggleHardcoded}
                  />

                  <div style={{display: store.mode !== 'gradle' ? 'none' : ''}}>
                    <h2 className="m-b-1">Language</h2>
                    <RadioGroup name="language" value={store.language} onChange={this.selectLanguage}>
                      <Radio value="groovy" label="Groovy"/>
                      <Radio value="kotlin" label="Kotlin" disabled={true}/>
                    </RadioGroup>
                  </div>

                  <div style={{display: store.mode === 'zip' ? 'none' : ''}}>
                    <h2 className="m-b-1">Natives</h2>
                    <RadioGroup name="natives" value={store.natives} onChange={this.selectNatives}>
                      <Radio value="windows" label="Windows"/>
                      <Radio value="macos" label="Mac OS"/>
                      <Radio value="linux" label="Linux"/>
                    </RadioGroup>
                  </div>

                  <div style={{display: store.build !== 'release' ? 'none' : ''}}>
                    <h2 className="m-b-1">Version</h2>
                    <RadioGroup name="version" value={store.version} onChange={this.selectVersion}>
                      {
                        config.versions.map(version => {
                          let vs = version.join('.');
                          return (
                            <Radio key={vs} value={vs} label={vs} disabled={version[2] > 0 || store.build === 'nightly'}/>
                          )
                        })
                      }
                    </RadioGroup>
                  </div>
                </div>

                <div className={classnames("col-xs-12", {"col-lg-3": store.mode !== 'zip', "col-lg-5": store.mode === 'zip'})}>
                  <h2 className="m-y-1">Contents</h2>
                  {
                    config
                      .artifacts
                      .map(item => (
                        <div key={item.id}>
                          <Checkbox
                            disabled={store.mode === 'zip' || store.visible[item.id] === false}
                            value={item.id}
                            label={item.name}
                            checked={store.checked[item.id] === true}
                            onChange={this.toggleArtifact}
                          />
                          {
                            store.descriptions
                              ?
                              <p className="m-b-2" style={{marginTop: '-1rem'}}>
                                <small>{item.description}</small>
                              </p>
                              : null
                          }
                        </div>
                      ))
                  }
                </div>

                {
                  store.mode === 'zip'
                    ? (
                    <div className="col-xs-12 col-lg-4">
                      <h2 className="m-b-2 m-t-1">Bundle</h2>
                      {/*<a className="btn btn-primary btn-lg" download={`lwjgl-${store.build}.zip`} href={store.download} target="_blank">DOWNLOAD ZIP</a>*/}
                      <a className="btn btn-primary btn-lg" href={store.download} target="_blank">DOWNLOAD ZIP</a>
                    </div>
                  )
                    : (
                    <div className="col-xs-12 col-lg-6">
                      <h2 className="m-b-2 m-t-1">Snippet</h2>
                      <textarea ref="script" className="script" readOnly={true} value={store.script} wrap="off"/>
                      <a className="btn btn-primary" download={store.filename} href={`data:${store.mime};base64,${btoa(store.script)}`}>DOWNLOAD SNIPPET</a>
                      {' '}
                      <button className="btn btn-primary" onClick={this.copyToClipboard}>COPY TO CLIPBOARD</button>
                    </div>
                  )
                }

              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default BuildConfigurator