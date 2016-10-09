import React from 'react'
import { connect } from 'react-redux'

const SUPPORTS_BTOA = process.browser ? !!window.btoa : false;
const SUPPORTS_CLIPBOARD = process.browser ? !!document.execCommand : false;

@connect(
  state => {
    if ( state.build.mode === 'zip' ) {
      return {
        mode: 'zip'
      }
    }

    const build = state.build;

    return {
      build: build.build,
      mode: build.mode,
      version: build.version,
      hardcoded: build.hardcoded,
      compact: build.compact,
      artifacts: build.artifacts,
      selected: build.contents,
    };
  }
)
class BuildScript extends React.Component {

  copyToClipboard = () => {
    this.script.select();
    document.execCommand('copy');
    this.script.blur();
  };

  autoHeight = () => {
    const newlines = this.script.value.match(/\n/g);
    this.script.style.height = newlines === null ? '20px' : `${Math.min((newlines.length + 1) * 20, 700)}px`;
  };

  render() {
    if ( this.props.mode === 'zip' ) {
      return null;
    }

    const {build, mode, version, hardcoded, compact, artifacts, selected} = this.props;

    setImmediate(this.autoHeight);

    const script = generateScript(build, mode, version, hardcoded, compact, artifacts, selected);

    return (
      <div className="col-xs-12 col-lg-6">
        <h2 className="m-b-2 m-t-1">Snippet</h2>
        <textarea ref={el => {this.script = el}} className="script" readOnly={true} value={script} wrap="off" />
        {
          SUPPORTS_BTOA ?
            <a
              className="btn btn-xs-block btn-primary"
              download={filename(mode)}
              href={`data:${mime(mode)};base64,${btoa(script)}`}
            >
              DOWNLOAD SNIPPET
            </a>
            : null
        }
        {
          SUPPORTS_CLIPBOARD ?
            <button className="btn btn-xs-block btn-primary" onClick={this.copyToClipboard}>COPY TO CLIPBOARD</button>
            : null
        }
      </div>
    )
  }

}

const filename = mode => mode === 'maven' ? 'pom.xml' : 'build.gradle';
const mime = mode => mode === 'maven' ? 'text/xml' : 'text/plain';

function generateScript(build, mode, version, hardcoded, compact, artifacts, selected) {
  const _version = build === "release" ? version : `${version}-SNAPSHOT`;

  if ( mode === 'maven' ) {
    return generateMaven(build, _version, hardcoded, compact, artifacts, selected);
  } else {
    return generateGradle(build, _version, hardcoded, artifacts, selected);
  }
}

function generateMaven(build, _version, hardcoded, compact, artifacts, selected) {
  let script = '';
  let nativesBundle = '';
  const v = hardcoded ? _version : '\${lwjgl.version}';
  const nl1 = compact ? '' : '\n\t';
  const nl2 = compact ? '' : '\n\t\t';
  const nl3 = compact ? '' : '\n\t\t\t';

  if ( !hardcoded ) {
    script += `<properties>
\t<maven.compiler.source>1.8</maven.compiler.source>
\t<maven.compiler.target>1.8</maven.compiler.target>
\t<lwjgl.version>${_version}</lwjgl.version>
</properties>
`;
  }

  script += `<profiles>
\t<profile>${nl2}<id>lwjgl-natives-linux></id>${nl2}<activation>${nl3}<os><family>unix</family></os>${nl2}</activation>${nl2}<properties>${nl3}<lwjgl.natives>natives-linux</lwjgl.natives>${nl2}</properties>${nl1}</profile>
\t<profile>${nl2}<id>lwjgl-natives-macos></id>${nl2}<activation>${nl3}<os><family>mac</family></os>${nl2}</activation>${nl2}<properties>${nl3}<lwjgl.natives>natives-macos</lwjgl.natives>${nl2}</properties>${nl1}</profile>
\t<profile>${nl2}<id>lwjgl-natives-windows></id>${nl2}<activation>${nl3}<os><family>windows</family></os>${nl2}</activation>${nl2}<properties>${nl3}<lwjgl.natives>natives-windows</lwjgl.natives>${nl2}</properties>${nl1}</profile>
</profiles>
`;

  if ( build !== "release" ) {
    script += `<repositories>
\t<!-- Add this repository to your Maven script -->
\t<repository>
\t\t<id>sonatype-snapshots</id>
\t\t<url>https://oss.sonatype.org/content/repositories/snapshots</url>
\t\t<releases><enabled>false</enabled></releases>
\t\t<snapshots><enabled>true</enabled></snapshots>
\t</repository>
</repositories>
`;
  }

  script += `<dependencies>
\t<!-- LWJGL dependencies START -->`;

  artifacts.allIds.forEach(artifact => {
    if ( selected[artifact] ) {
      script += `\n\t<dependency>${nl2}<groupId>org.lwjgl</groupId>${nl2}<artifactId>${artifact}</artifactId>${nl2}<version>${v}</version>${nl1}</dependency>`;
      if ( artifacts.byId[artifact].natives !== undefined ) {
        nativesBundle += `\n\t<dependency>${nl2}<groupId>org.lwjgl</groupId>${nl2}<artifactId>${artifact}</artifactId>${nl2}<version>${v}</version>${nl2}<classifier>\${lwjgl.natives}</classifier>${nl2}<scope>runtime</scope>${nl1}</dependency>`;
      }
    }
  });

  script += `\n${nativesBundle}\n\t<!-- LWJGL dependencies END -->\n</dependencies>`;

  return script;
}

function generateGradle(build, _version, hardcoded, artifacts, selected) {
  let script = '';
  let nativesBundle = '';
  const v = hardcoded ? _version : '\${lwjglVersion}';

  script += `import org.gradle.internal.os.OperatingSystem
      
  switch ( OperatingSystem.current() ) {
    case OperatingSystem.WINDOWS:
      project.ext.lwjglNatives = "natives-windows"
      break
    case OperatingSystem.LINUX:
      project.ext.lwjglNatives = "natives-linux"
      break
    case OperatingSystem.MAC_OS:
      project.ext.lwjglNatives = "natives-macos"
      break
  }\n\n`;

  if ( !hardcoded ) {
    script += `// Add these properties to your Gradle script
  project.ext.lwjglVersion = "${_version}"
  
  `;
  }

  if ( build !== "release" ) {
    script += `repositories {
  \t// Add this repository to your Gradle script
  \tmaven { url "https://oss.sonatype.org/content/repositories/snapshots/" }
  }
  
  `;
  }

  script += `dependencies {
  \t// LWJGL dependencies START`;

  artifacts.allIds.forEach(artifact => {
    if ( selected[artifact] ) {
      script += `\n\tcompile "org.lwjgl:${artifact}:${v}"`;
      if ( artifacts.byId[artifact].natives !== undefined ) {
        nativesBundle += `\n\truntime "org.lwjgl:${artifact}:${v}:\${lwjglNatives}"`;
      }
    }
  });

  script += `\n\t// LWJGL natives${nativesBundle}\n\t// LWJGL dependencies END
  }`;

  return script;
}

export default BuildScript
