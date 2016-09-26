import {observable, action, computed} from 'mobx';
import config from '../../../../common/BuildConfig'

function buildCollection(presetArr) {
  const obj = {};
  config.presets.all.forEach(preset => {
    obj[preset] = false;
  });
  presetArr.forEach(preset => {
    obj[preset] = true;
  });
  return obj;
}

const presets = {};

Object.keys(config.presets).forEach(preset => {
  presets[preset] = buildCollection(config.presets[preset]);
});

function getDefaultNative() {
  if ( process.browser ) {
    if ( navigator.platform.indexOf('Mac') > -1 || navigator.platform.indexOf('iP') > -1 ) {
      return 'macos';
    } else if ( navigator.platform.indexOf('Linux') > -1 ) {
      return 'linux';
    }
  }

  return 'windows';
}

class BuildsStore {
  @observable build = null;
  @observable visible = {...presets.all};
  @observable checked = {...presets.all};
  @observable version = config.versions[1].join('.');
  @observable mode = 'zip';
  @observable preset = 'all';
  @observable language = 'groovy';
  @observable natives = 'windows';
  @observable hardcoded = false;
  @observable compact = true;
  @observable source = true;
  @observable javadoc = true;
  @observable descriptions = false;

  constructor() {
    this.selectNatives(getDefaultNative());
  }

  get config() {
    return config;
  }

  @action selectBuild(build) {
    this.build = build;

    if ( build !== null ) {
      if ( this.build === 'nightly' ) {
        this.selectVersion(config.versions[0].join('.'));
      } else {
        this.selectMode('zip');
        this.selectVersion(config.versions[1].join('.'));
      }
    }
  }

  @action setOption(field, value) {
    switch (field) {
      case 'mode':
        this.selectMode(value);
        break;
      case 'preset':
        this.selectPreset(value);
        break;
      case 'language':
        this.selectLanguage(value);
        break;
      case 'natives':
        this.selectNatives(value);
        break;
      case 'descriptions':
      case 'source':
      case 'javadoc':
      case 'compact':
      case 'hardcoded':
        this[field] = !this[field];
        break;
    }
  }

  getOptions(field) {
    switch (field) {
      case 'mode':
        return this.getOptionsMode();
      case 'preset':
        return this.getOptionsPreset();
      case 'language':
        return this.getOptionsLanguage();
      case 'natives':
        return this.getOptionsNatives();
      case 'version':
        return this.getOptionsVersion();
      case 'descriptions':
        return {
          label: 'Show descriptions',
          hidden: false,
          disabled: false,
        };
      case 'source':
        return {
          label: 'Include source',
          hidden: this.mode !== 'zip',
          disabled: true,
        };
      case 'javadoc':
        return {
          label: 'Show descriptions',
          hidden: this.mode !== 'zip',
          disabled: true,
        };
      case 'compact':
        return {
          label: 'Compact Mode',
          hidden: this.mode !== 'maven',
          disabled: false,
        };
      case 'hardcoded':
        return {
          label: 'Do not use variables',
          hidden: this.mode === 'zip',
          disabled: false,
        };
    }
  }

  getOptionsMode() {
    let notNightly = this.build !== 'nightly';
    return [
      {
        value: 'zip',
        label: 'ZIP Bundle',
        disabled: false,
      },
      {
        value: 'maven',
        label: 'Maven',
        disabled: notNightly,
      },
      {
        value: 'gradle',
        label: 'Gradle',
        disabled: notNightly,
      },
    ];
  }

  @action selectMode(mode) {
    this.mode = mode;
    if ( mode === 'zip' ) {
      this.selectPreset('all');
    }
  }

  getOptionsPreset() {
    let ZIPMODE = this.mode === 'zip';
    return [
      {
        value: 'none',
        label: 'None',
        disabled: ZIPMODE,
      },
      {
        value: 'all',
        label: 'Everything',
        disabled: ZIPMODE,
      },
      {
        value: 'getting-started',
        label: 'Getting Started',
        disabled: ZIPMODE,
      },
      {
        value: 'minimal-opengl',
        label: 'Minimal OpenGL',
        disabled: ZIPMODE,
      },
      {
        value: 'minimal-opengles',
        label: 'Minimal OpenGL ES',
        disabled: ZIPMODE,
      },
      {
        value: 'minimal-vulkan',
        label: 'Minimal Vulkan',
        disabled: ZIPMODE,
      },
      {
        value: 'custom',
        label: 'Custom',
        disabled: ZIPMODE,
      },
    ]
  }

  @action selectPreset(preset) {
    this.preset = preset;
    if ( preset !== 'custom' ) {
      Object.keys(this.checked).forEach(key => {
        this.checked[key] = false;
      });

      Object.keys(presets[preset]).forEach(key => {
        this.checked[key] = presets[preset][key];
      });

      this.selectNatives(this.natives);
    }
  }

  getOptionsVersion() {
    return config.versions.map(version => {
      let vs = version.join('.');
      return {
        value: vs,
        label: vs,
        disabled: version[2] > 0 || this.build === 'nightly',
      };
    });
  }

  @action selectVersion(version) {
    // TODO: Re-enable or hide deprecated artifacts
    this.version = version;
  }

  getArtifactOptions(name) {
    const artifact = config.artifacts[config.index[name]];

    return {
      label: artifact.name,
      value: artifact.id,
      disabled: this.mode === 'zip' || this.visible[artifact.id] === false
    };
  }

  @action toggleArtifact(item) {
    if ( item === 'lwjgl' ) {
      return;
    }
    if ( this.preset !== 'custom' ) {
      this.preset = 'custom';
    }
    this.checked[item] = !this.checked[item];
  }

  getOptionsLanguage() {
    return [
      {
        value: 'groovy',
        label: 'Groovy',
        disabled: false,
      },
      {
        value: 'kotlin',
        label: 'Kotlin',
        disabled: true,
      },
    ]
  }

  @action selectLanguage(language) {
    this.language = language;
  }

  getOptionsNatives() {
    return [
      {
        value: 'windows',
        label: 'Windows',
        disabled: false,
      },
      {
        value: 'macos',
        label: 'Mac OS',
        disabled: false,
      },
      {
        value: 'linux',
        label: 'Linux',
        disabled: false,
      },
    ];
  }

  @action selectNatives(natives) {
    this.natives = natives;

    config.artifacts.forEach(artifact => {
      if ( artifact.natives && artifact.natives.indexOf(natives) === -1 ) {
        this.visible[artifact.id] = false;
        this.checked[artifact.id] = false;
      } else {
        this.visible[artifact.id] = true;
      }
    });
  }

  @computed get download() {
    let url;

    switch (this.build) {
      case 'release':
        url = `http://build.lwjgl.org/${this.build}/${this.version}/lwjgl-${this.version}.zip`;
        break;
      default:
        url = `http://build.lwjgl.org/${this.build}/lwjgl.zip`;
    }

    return url;
  }

  @computed get filename() {
    return this.mode === 'maven' ? 'pom.xml' : 'build.gradle';
  }

  @computed get mime() {
    return this.mode === 'maven' ? 'text/xml' : 'text/plain';
  }

  @computed get script() {
    let version = this.build === "release" ? this.version : `${this.version}-SNAPSHOT`;

    let script = "";
    if ( this.mode === 'maven' ) {
      let v = this.hardcoded ? version : '\${lwjgl.version}';
      let n = this.hardcoded ? `natives-${this.natives}` : '\${lwjgl.natives}';
      let nl = this.compact ? '' : '\n\t\t';
      let nle = this.compact ? '' : '\n\t';

      if ( !this.hardcoded ) {
        script += `<properties>
\t<maven.compiler.source>1.8</maven.compiler.source>
\t<maven.compiler.target>1.8</maven.compiler.target>
\t<!-- Add these properties to your Maven script -->
\t<lwjgl.version>${version}</lwjgl.version>
\t<lwjgl.natives>natives-${this.natives}</lwjgl.natives>
</properties>
`;
      }

      if ( this.build !== "release" ) {
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

      for (let binding in this.checked) {
        if ( this.checked[binding] ) {
          script += `\n\t<dependency>${nl}<groupId>org.lwjgl</groupId>${nl}<artifactId>${binding}</artifactId>${nl}<version>${v}</version>${nle}</dependency>`
        }
      }

      script += '\n';

      for (let binding in this.checked) {
        if ( this.checked[binding] && config.artifacts[config.index[binding]].natives !== undefined ) {
          script += `\n\t<dependency>${nl}<groupId>org.lwjgl</groupId>${nl}<artifactId>${binding}</artifactId>${nl}<version>${v}</version>${nl}<classifier>${n}</classifier>${nl}<scope>runtime</scope>${nle}</dependency>`
        }
      }

      script += `\n\t<!-- LWJGL Dependencies END -->\n</dependencies>`;
    } else {
      let v = this.hardcoded ? version : '\${lwjglVersion}';
      let n = this.hardcoded ? `natives-${this.natives}` : '\${lwjglNatives}';

      if ( !this.hardcoded ) {
        script += `// Add these properties to your Gradle script
project.ext.lwjglVersion = "${version}"
project.ext.lwjglNatives = "natives-${this.natives}"

`;
      }

      if ( this.build !== "release" ) {
        script += `repositories {
\t// Add this repository to your Gradle script
\tmaven { url "https://oss.sonatype.org/content/repositories/snapshots/" }
}

`;
      }

      script += `dependencies {
\t// LWJGL dependencies START`;

      for (let binding in this.checked) {
        if ( this.checked[binding] ) {
          script += `\n\tcompile "org.lwjgl:${binding}:${v}"`
        }
      }

      script += '\n';

      for (let binding in this.checked) {
        if ( this.checked[binding] && config.artifacts[config.index[binding]].natives !== undefined ) {
          script += `\n\truntime "org.lwjgl:${binding}:${v}:${n}"`;
        }
      }

      script += `
\t// LWJGL dependencies END
}`;
    }

    return script;
  }

}

export default new BuildsStore();
