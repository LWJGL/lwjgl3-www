import { State } from '../BuildScript';
import { Addon, BuildType, Native } from '../types';
import { generateDependencies, getArtifactName, getVersion, isNativeApplicableToAllPlatforms } from './script';
import { versionNum } from '../reducer';

export function generateMaven({
  build,
  version,
  hardcoded,
  compact,
  osgi,
  platform,
  platformSingle,
  artifacts,
  selected,
  addons,
  selectedAddons,
}: State) {
  const versionAlias = getVersion(version, build);
  const v = hardcoded ? versionAlias : '${lwjgl.version}';
  const nl2 = compact ? '' : '\n\t\t';
  const nl3 = compact ? '' : '\n\t\t\t';
  const nl4 = compact ? '' : '\n\t\t\t\t';
  const nl5 = compact ? '' : '\n\t\t\t\t\t';
  const classifier = !hardcoded || platformSingle == null ? '${lwjgl.natives}' : `natives-${platformSingle}`;
  const hasBoM = 323 <= versionNum(version);

  let script = '';
  if (!hardcoded) {
    script += `\t<properties>
\t\t<lwjgl.version>${versionAlias}</lwjgl.version>`;

    selectedAddons.forEach((id: Addon) => {
      script += `\n\t\t<${id}.version>${addons[id].maven.version}</${id}.version>`;
    });

    if (platformSingle !== null) {
      script += `\n\t\t<lwjgl.natives>natives-${platformSingle}</lwjgl.natives>`;
    }

    script += `\n\t</properties>\n\n`;
  }
  if (platformSingle === null) {
    function generateProfile(profile: Native, family: string, arch: string, natives: String) {
      let dependencies = selected
        .filter((binding) => {
          const artifact = artifacts[binding];
          return (
            artifact.natives !== undefined &&
            artifact.natives.includes(profile) &&
            !isNativeApplicableToAllPlatforms(artifact, platform)
          );
        })
        .map((binding) => {
          const groupId = osgi ? 'org.lwjgl.osgi' : 'org.lwjgl';
          const artifactId = osgi ? `org.lwjgl.${getArtifactName(artifacts[binding])}` : binding;
          return `${nl4}<dependency>${nl5}<groupId>${groupId}</groupId>${nl5}<artifactId>${artifactId}</artifactId>${
            hasBoM ? '' : `${nl5}<version>${v}</version>`
          }${nl5}<classifier>${natives}</classifier>${nl4}</dependency>`;
        });

      return `\n\t\t<profile>${nl3}<id>lwjgl-natives-${profile}-${arch}</id>${nl3}<activation>${nl4}<os>${nl5}<family>${family}</family>${nl5}<arch>${arch}</arch>${nl4}</os>${nl3}</activation>${nl3}<properties>${nl4}<lwjgl.natives>${natives}</lwjgl.natives>${nl3}</properties>${
        dependencies.length === 0 ? '' : `${nl3}<dependencies>${dependencies.join(nl4)}${nl3}</dependencies>`
      }${nl2}</profile>`;
    }
    script += '\t<profiles>';
    if (platform.linux) {
      script += generateProfile(Native.Linux, 'unix', 'amd64', 'natives-linux');
    }
    if (platform['linux-arm64']) {
      script += generateProfile(Native.Linux, 'unix', 'aarch64', 'natives-linux-arm64');
    }
    if (platform['linux-arm32']) {
      script += generateProfile(Native.Linux, 'unix', 'arm', 'natives-linux-arm32');
      script += generateProfile(Native.Linux, 'unix', 'arm32', 'natives-linux-arm32');
    }
    if (platform.macos) {
      script += generateProfile(Native.MacOS, 'mac', 'amd64', 'natives-macos');
    }
    if (platform.windows) {
      script += generateProfile(Native.Windows, 'windows', 'amd64', 'natives-windows');
    }
    if (platform['windows-x86']) {
      script += generateProfile(Native.Windows, 'windows', 'x86', 'natives-windows-x86');
    }
    script += '\n\t</profiles>\n\n';
  }

  if (build !== BuildType.Release) {
    script += `\t<repositories>
\t\t<repository>
\t\t\t<id>sonatype-snapshots</id>
\t\t\t<url>https://oss.sonatype.org/content/repositories/snapshots</url>
\t\t\t<releases><enabled>false</enabled></releases>
\t\t\t<snapshots><enabled>true</enabled></snapshots>
\t\t</repository>
\t</repositories>\n\n`;
  }

  if (hasBoM) {
    script += `\t<dependencyManagement>
\t\t<dependencies>
\t\t\t<dependency>
\t\t\t\t<groupId>org.lwjgl</groupId>
\t\t\t\t<artifactId>lwjgl-bom</artifactId>
\t\t\t\t<version>${v}</version>
\t\t\t\t<scope>import</scope>
\t\t\t\t<type>pom</type>
\t\t\t</dependency>
\t\t</dependencies>
\t</dependencyManagement>\n\n`;
  }

  script += `\t<dependencies>`;

  script += generateDependencies(
    selected,
    artifacts,
    platform,
    osgi,
    (artifact, groupId, artifactId) =>
      `\n\t\t<dependency>${nl3}<groupId>${groupId}</groupId>${nl3}<artifactId>${artifactId}</artifactId>${
        hasBoM ? '' : `${nl3}<version>${v}</version>`
      }${nl2}</dependency>`,
    (artifact, groupId, artifactId) => {
      if (!isNativeApplicableToAllPlatforms(artifact, platform)) {
        return '';
      }
      return `\n\t\t<dependency>${nl3}<groupId>${groupId}</groupId>${nl3}<artifactId>${artifactId}</artifactId>${
        hasBoM ? '' : `${nl3}<version>${v}</version>`
      }${nl3}<classifier>${classifier}</classifier>${nl2}</dependency>`;
    }
  );

  selectedAddons.forEach((id: Addon) => {
    const {
      maven: { groupId, artifactId, version },
    } = addons[id];

    script += `\n\t\t<dependency>${nl3}<groupId>${groupId}</groupId>${nl3}<artifactId>${artifactId}</artifactId>${nl3}<version>${
      hardcoded ? version : `\${${id}.version}`
    }</version>${nl2}</dependency>`;
  });

  script += `\n\t</dependencies>`;

  return script;
}
