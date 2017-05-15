import React from 'react';
import { connect } from 'react-redux';
import { MODE_ZIP, MODE_MAVEN, MODE_GRADLE, MODE_IVY, BUILD_RELEASE } from '../constants';

import BuildToolbar from './BuildToolbar';
import IconDownload from 'react-icons/md/file-download';
import IconCopy from 'react-icons/md/content-copy';

const ALLOW_DOWNLOAD = window.btoa !== undefined;

class BuildScript extends React.Component {
  script: HTMLPreElement;

  copyToClipboard = () => {
    if (window.getSelection === undefined) {
      alert('Copying to clipboard not supported!');
      return;
    }
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      selection.removeAllRanges();
    }
    const range = document.createRange();
    range.selectNode(this.script);
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    alert('Script copied to clipboard.');
  };

  getRef = (el: HTMLPreElement) => {
    this.script = el;
  };

  render() {
    const { mode } = this.props;

    if (mode.id === MODE_ZIP) {
      return null;
    }

    const { current, sm, md } = this.props.breakpoint;
    const labels = {
      download: `DOWNLOAD ${mode.file.toUpperCase()}`,
      copy: ' COPY TO CLIPBOARD',
    };

    if (current < sm) {
      labels.download = 'DOWNLOAD';
      labels.copy = '';
    } else if (current < md) {
      labels.copy = ' COPY';
    }

    const script = generateScript(mode.id, this.props);

    return (
      <div>
        <h2 className="mt-1">
          <img src={mode.logo} alt={mode.title} style={{ height: 60 }} />
        </h2>
        <pre ref={this.getRef}>
          <code>{script}</code>
        </pre>
        <BuildToolbar>
          <a
            className="btn btn-success"
            download={mode.file}
            href={`data:${mime(mode)};base64,${btoa(script)}`}
            disabled={ALLOW_DOWNLOAD}
            title={`Download ${mode} code snippet`}
          >
            <IconDownload /> {labels.download}
          </a>
          <button
            className="btn btn-success"
            onClick={this.copyToClipboard}
            disabled={!document.execCommand}
            title="Copy to clipboard"
          >
            <IconCopy />{labels.copy}
          </button>
        </BuildToolbar>
      </div>
    );
  }
}

const mime = mode => (mode.file.endsWith('.xml') ? 'text/xml' : 'text/plain');
const getVersion = (version, build) => (build === BUILD_RELEASE ? version : `${version}-SNAPSHOT`);

function generateScript(mode, props) {
  switch (mode) {
    case MODE_MAVEN:
      return generateMaven(props);
    case MODE_GRADLE:
      return generateGradle(props);
    case MODE_IVY:
      return generateIvy(props);
    default:
      throw 'Unsupported script mode';
  }
}

function generateMaven(props) {
  const { build, hardcoded, compact, osgi, artifacts, selected, addons, selectedAddons } = props;
  const version = getVersion(props.version, build);
  let script = '';
  let nativesBundle = '';
  const v = hardcoded ? version : '\${lwjgl.version}';
  const nl1 = compact ? '' : '\n\t';
  const nl2 = compact ? '' : '\n\t\t';
  const nl3 = compact ? '' : '\n\t\t\t';
  const groupId = osgi ? 'org.lwjgl.osgi' : 'org.lwjgl';

  if (!hardcoded) {
    script += `<properties>
\t<maven.compiler.source>1.8</maven.compiler.source>
\t<maven.compiler.target>1.8</maven.compiler.target>
\t<lwjgl.version>${version}</lwjgl.version>`;

    selectedAddons.forEach(addon => {
      script += `\n\t<${addon}.version>${addons.byId[addon].maven.version}</${addon}.version>`;
    });

    script += `\n</properties>\n\n`;
  }

  script += `<dependencies>`;

  selected.forEach(artifact => {
    script += `\n\t<dependency>${nl2}<groupId>${groupId}</groupId>${nl2}<artifactId>${artifact}</artifactId>${nl2}<version>${v}</version>${nl1}</dependency>`;
    if (artifacts[artifact].natives !== undefined) {
      nativesBundle += `\n\t<dependency>${nl2}<groupId>${groupId}</groupId>${nl2}<artifactId>${artifact}</artifactId>${nl2}<version>${v}</version>${nl2}<classifier>\${lwjgl.natives}</classifier>${nl2}<scope>runtime</scope>${nl1}</dependency>`;
    }
  });

  script += nativesBundle;

  selectedAddons.forEach(addon => {
    const maven = addons.byId[addon].maven;
    script += `\n\t<dependency>${nl2}<groupId>${maven.groupId}</groupId>${nl2}<artifactId>${maven.artifactId}</artifactId>${nl2}<version>${hardcoded ? maven.version : `\${${addon}.version}`}</version>${nl1}</dependency>`;
  });

  script += `\n</dependencies>`;

  if (build !== BUILD_RELEASE) {
    script += `\n\n<repositories>
\t<repository>
\t\t<id>sonatype-snapshots</id>
\t\t<url>https://oss.sonatype.org/content/repositories/snapshots</url>
\t\t<releases><enabled>false</enabled></releases>
\t\t<snapshots><enabled>true</enabled></snapshots>
\t</repository>
</repositories>`;
  }

  script += `\n\n<profiles>
\t<profile>${nl2}<id>lwjgl-natives-linux</id>${nl2}<activation>${nl3}<os><family>unix</family></os>${nl2}</activation>${nl2}<properties>${nl3}<lwjgl.natives>natives-linux</lwjgl.natives>${nl2}</properties>${nl1}</profile>
\t<profile>${nl2}<id>lwjgl-natives-macos</id>${nl2}<activation>${nl3}<os><family>mac</family></os>${nl2}</activation>${nl2}<properties>${nl3}<lwjgl.natives>natives-macos</lwjgl.natives>${nl2}</properties>${nl1}</profile>
\t<profile>${nl2}<id>lwjgl-natives-windows</id>${nl2}<activation>${nl3}<os><family>windows</family></os>${nl2}</activation>${nl2}<properties>${nl3}<lwjgl.natives>natives-windows</lwjgl.natives>${nl2}</properties>${nl1}</profile>
</profiles>
`;

  return script;
}

function generateGradle(props) {
  const { build, hardcoded, osgi, artifacts, selected, addons, selectedAddons } = props;
  const version = getVersion(props.version, build);
  let script = '';
  let nativesBundle = '';
  const v = hardcoded ? version : '\${lwjglVersion}';
  const groupId = osgi ? 'org.lwjgl.osgi' : 'org.lwjgl';

  script += `import org.gradle.internal.os.OperatingSystem

switch ( OperatingSystem.current() ) {
\tcase OperatingSystem.WINDOWS:
\t\tproject.ext.lwjglNatives = "natives-windows"
\t\tbreak
\tcase OperatingSystem.LINUX:
\t\tproject.ext.lwjglNatives = "natives-linux"
\tbreak
\tcase OperatingSystem.MAC_OS:
\t\tproject.ext.lwjglNatives = "natives-macos"
\t\tbreak
}\n\n`;

  if (!hardcoded) {
    script += `project.ext.lwjglVersion = "${version}"\n`;
    selectedAddons.forEach(addon => {
      const maven = addons.byId[addon].maven;
      script += `project.ext.${addon}Version = "${maven.version}"\n`;
    });
    script += `\n`;
  }

  script += `repositories {`;

  if (build === BUILD_RELEASE || selectedAddons.length) {
    script += `\n\tmavenCentral()`;
  }
  if (build !== BUILD_RELEASE) {
    script += `\n\tmaven { url "https://oss.sonatype.org/content/repositories/snapshots/" }`;
  }
  script += `\n}\n\n`;

  script += `dependencies {`;

  selected.forEach(artifact => {
    script += `\n\tcompile "${groupId}:${artifact}:${v}"`;
    if (artifacts[artifact].natives !== undefined) {
      nativesBundle += `\n\truntime "${groupId}:${artifact}:${v}:\${lwjglNatives}"`;
    }
  });

  script += nativesBundle;

  selectedAddons.forEach(addon => {
    const maven = addons.byId[addon].maven;
    script += `\n\tcompile "${maven.groupId}:${maven.artifactId}:${hardcoded ? maven.version : `\${${addon}Version}`}"`;
  });

  script += `\n}`;

  return script;
}

function generateIvy(props) {
  const { build, hardcoded, osgi, compact, artifacts, selected, addons, selectedAddons } = props;
  const version = getVersion(props.version, build);
  let script = '';
  let nativesBundle = '';
  const v = hardcoded ? version : '\${lwjgl.version}';
  const nl1 = compact ? '' : '\n\t';
  const nl2 = compact ? '' : '\n\t\t';
  const nl3 = compact ? '' : '\n\t\t\t';
  const groupId = osgi ? 'org.lwjgl.osgi' : 'org.lwjgl';

  if (!hardcoded || build !== BUILD_RELEASE) script += `\t<!-- Add to ivysettings.xml -->`;

  if (build !== BUILD_RELEASE) {
    script += `\n\t<settings defaultResolver="maven-with-snapshots"/>
\t<resolvers>
\t\t<chain name="maven-with-snapshots">
\t\t\t<ibiblio name="sonatype-snapshots" m2compatible="true" root="https://oss.sonatype.org/content/repositories/snapshots/"/>
\t\t\t<ibiblio name="maven-central" m2compatible="true"/>
\t\t</chain>
\t</resolvers>`;
  }

  if (!hardcoded) {
    script += `\n\t<property name="lwjgl.version" value="${version}"/>`;

    selectedAddons.forEach(addon => {
      script += `\n\t<property name="${addon}.version" value="${addons.byId[addon].maven.version}"/>`;
    });
  }

  script += `\n\t<!-- Add to build.xml -->
\t<condition property="lwjgl.natives" value="natives-windows">${nl2}<os family="Windows"/>${nl1}</condition>
\t<condition property="lwjgl.natives" value="natives-linux">${nl2}<os name="Linux"/>${nl1}</condition>
\t<condition property="lwjgl.natives" value="natives-macos">${nl2}<os name="Mac OS X"/>${nl1}</condition>`;

  script += `\n\t<!-- Add to ivy.xml (xmlns:m="http://ant.apache.org/ivy/maven") -->
\t<dependencies>`;

  selected.forEach(artifact => {
    if (artifacts[artifact].natives === undefined) {
      script += `\n\t\t<dependency org="${groupId}" name="${artifact}" rev="${v}"/>`;
    } else {
      script += `\n\t\t<dependency org="${groupId}" name="${artifact}" rev="${v}">${nl3}<artifact name="${artifact}" type="jar"/>${nl3}<artifact name="${artifact}" type="jar" m:classifier="\${lwjgl.natives}"/>${nl2}</dependency>`;
    }
  });

  script += nativesBundle;

  selectedAddons.forEach(addon => {
    const maven = addons.byId[addon].maven;
    script += `\n\t\t<dependency org="${maven.groupId}" name="${maven.artifactId}" rev="${hardcoded ? maven.version : `\${${addon}.version}`}"/>`;
  });

  script += `\n\t</dependencies>`;

  return script;
}

export default connect(({ build, breakpoint }) => {
  if (build.mode === MODE_ZIP) {
    return {
      breakpoint,
      mode: build.modes.byId[build.mode],
    };
  }

  const selected = [];

  build.artifacts.allIds.forEach(artifact => {
    if (build.contents[artifact] && build.availability[artifact]) {
      selected.push(artifact);
    }
  });

  return {
    breakpoint,
    build: build.build,
    mode: build.modes.byId[build.mode],
    version: build.artifacts.version,
    hardcoded: build.hardcoded,
    compact: build.compact,
    osgi: build.osgi && parseInt(build.version.replace(/\./g, ''), 10) >= 312,
    artifacts: build.artifacts.byId,
    addons: build.addons,
    selected,
    selectedAddons: build.selectedAddons,
  };
})(BuildScript);
