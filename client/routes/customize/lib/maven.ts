import { State } from '../BuildScript';
import { Addon, BuildType, Native } from '../types';
import { generateDependencies, getArtifactName, getVersion, isNativeApplicableToAllPlatforms } from './script';

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
  const classifier = !hardcoded || platformSingle == null ? '${lwjgl.natives}' : `natives-${platformSingle}`;

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
    function generateProfile(profile: Native, family: string, natives: String) {
      let classifierOverrides = selected
        .filter(binding => !isNativeApplicableToAllPlatforms(artifacts[binding], platform))
        .map(binding => {
          let artifact = artifacts[binding];
          let property = `lwjgl.natives.${getArtifactName(artifact)}`;
          return `<${property}>${
            artifact.natives !== undefined && artifact.natives.includes(profile) ? `natives-${profile}` : ''
          }</${property}>`;
        });

      return `\n\t\t<profile>${nl3}<id>lwjgl-natives-${profile}</id>${nl3}<activation>${nl4}<os><family>${family}</family></os>${nl3}</activation>${nl3}<properties>${nl4}${natives}${
        classifierOverrides.length === 0 ? '' : `${nl4}${classifierOverrides.join(nl4)}`
      }${nl3}</properties>${nl2}</profile>`;
    }

    script += '\t<profiles>';
    if (platform.linux || platform['linux-arm64'] || platform['linux-arm32']) {
      const linuxArches = +platform.linux + +platform['linux-arm64'] + +platform['linux-arm32'];
      script += generateProfile(
        Native.Linux,
        'unix',
        linuxArches === 1
          ? `<lwjgl.natives>natives-linux${
              platform.linux ? '' : platform['linux-arm64'] ? '-arm64' : '-arm32'
            }</lwjgl.natives>`
          : `<lwjgl.natives>natives-linux</lwjgl.natives> <!-- Add -arm64 or -arm32 to get the ARM builds -->`
        // TODO: can we do better?
      );
    }
    if (platform.macos) {
      script += generateProfile(Native.MacOS, 'mac', '<lwjgl.natives>natives-macos</lwjgl.natives>');
    }
    if (platform.windows || platform['windows-x86']) {
      const windowsArches = +platform.windows + +platform['windows-x86'];
      script += generateProfile(
        Native.Windows,
        'windows',
        windowsArches === 1
          ? `<lwjgl.natives>natives-windows${platform.windows ? '' : '-x86'}</lwjgl.natives>`
          : `<lwjgl.natives>natives-windows</lwjgl.natives> <!-- Add -x86 to get the x86 builds -->`
        // TODO: can we do better?
      );
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

  script += `\t<dependencies>`;

  script += generateDependencies(
    selected,
    artifacts,
    platform,
    osgi,
    (artifact, groupId, artifactId) =>
      `\n\t\t<dependency>${nl3}<groupId>${groupId}</groupId>${nl3}<artifactId>${artifactId}</artifactId>${nl3}<version>${v}</version>${nl2}</dependency>`,
    (artifact, groupId, artifactId) => {
      return `\n\t\t<dependency>${nl3}<groupId>${groupId}</groupId>${nl3}<artifactId>${artifactId}</artifactId>${nl3}<version>${v}</version>${nl3}<classifier>${
        isNativeApplicableToAllPlatforms(artifact, platform)
          ? classifier
          : `\${lwjgl.natives.${getArtifactName(artifact)}}`
      }</classifier>${nl2}</dependency>`;
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
