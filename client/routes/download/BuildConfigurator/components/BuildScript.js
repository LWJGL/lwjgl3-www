import React from 'react'
import {connect} from 'react-redux'

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
      platform: build.platform,
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
    this.script.style.height = newlines !== null ? `${Math.min((newlines.length + 1) * 20, 700)}px` : '20px';
  };

  render() {
    if ( this.props.mode === 'zip' ) {
      return null;
    }

    const {build, mode, version, hardcoded, compact, platform, artifacts, selected} = this.props;

    setImmediate(this.autoHeight);

    const script = generateScript(build, mode, version, hardcoded, compact, platform, artifacts, selected);

    return (
      <div className="col-xs-12 col-lg-6">
        <h2 className="m-b-2 m-t-1">Snippet</h2>
        <textarea ref={el => this.script = el} className="script" readOnly={true} value={script} wrap="off" />
        <a
          className="btn btn-xs-block btn-primary"
          download={filename(mode)}
          href={`data:${mime(mode)};base64,${btoa(script)}`}
        >
          DOWNLOAD SNIPPET
        </a>
        <button className="btn btn-xs-block btn-primary" onClick={this.copyToClipboard}>COPY TO CLIPBOARD</button>
      </div>
    )
  }

}

const filename = mode => mode === 'maven' ? 'pom.xml' : 'build.gradle';
const mime = mode => mode === 'maven' ? 'text/xml' : 'text/plain';

const generateScript = (build, mode, version, hardcoded, compact, platform, artifacts, selected) => {
  let script = '';
  let nativesBundle = '';
  const _version = build === "release" ? version : `${version}-SNAPSHOT`;

  if ( mode === 'maven' ) {
    const v = hardcoded ? _version : '\${lwjgl.version}';
    const n = hardcoded ? `natives-${platform}` : '\${lwjgl.natives}';
    const nl = compact ? '' : '\n\t\t';
    const nle = compact ? '' : '\n\t';

    if ( !hardcoded ) {
      script += `<properties>
\t<maven.compiler.source>1.8</maven.compiler.source>
\t<maven.compiler.target>1.8</maven.compiler.target>
\t<!-- Add these properties to your Maven script -->
\t<lwjgl.version>${_version}</lwjgl.version>
\t<lwjgl.natives>natives-${platform}</lwjgl.natives>
</properties>
`;
    }

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
\t<!-- LWJGL Dependencies START -->`;

    artifacts.allIds.forEach(artifact => {
      const natives = artifacts.byId[artifact].natives;
      if ( selected[artifact] && ( natives === undefined || natives.indexOf(platform) > -1 ) ) {
        script += `\n\t<dependency>${nl}<groupId>org.lwjgl</groupId>${nl}<artifactId>${artifact}</artifactId>${nl}<version>${v}</version>${nle}</dependency>`;
        if ( natives !== undefined ) {
          nativesBundle += `\n\t<dependency>${nl}<groupId>org.lwjgl</groupId>${nl}<artifactId>${artifact}</artifactId>${nl}<version>${v}</version>${nl}<classifier>${n}</classifier>${nl}<scope>runtime</scope>${nle}</dependency>`;
        }
      }
    });

    script += `\n${nativesBundle}\n\t<!-- LWJGL Dependencies END -->\n</dependencies>`;
  } else {
    const v = hardcoded ? _version : '\${lwjglVersion}';
    const n = hardcoded ? `natives-${platform}` : '\${lwjglNatives}';

    if ( !hardcoded ) {
      script += `// Add these properties to your Gradle script
project.ext.lwjglVersion = "${_version}"
project.ext.lwjglNatives = "natives-${platform}"

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
      const natives = artifacts.byId[artifact].natives;
      if ( selected[artifact] && ( natives === undefined || natives.indexOf(platform) > -1 ) ) {
        script += `\n\tcompile "org.lwjgl:${artifact}:${v}"`;
        if ( natives !== undefined ) {
          nativesBundle += `\n\truntime "org.lwjgl:${artifact}:${v}:${n}"`;
        }
      }
    });

    script += `\n${nativesBundle}
\t// LWJGL dependencies END
}`;
  }

  return script;
};

export default BuildScript
