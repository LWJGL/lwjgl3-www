import { State } from '../BuildScript';
import { Addon, BuildType } from '../types';
import { generateDependencies, getVersion } from './script';

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
    script += `\t<profiles>
\t\t<profile>${nl3}<id>lwjgl-natives-linux</id>${nl3}<activation>${nl4}<os><family>unix</family></os>${nl3}</activation>${nl3}<properties>${nl4}<lwjgl.natives>natives-linux</lwjgl.natives>${nl3}</properties>${nl2}</profile>
\t\t<profile>${nl3}<id>lwjgl-natives-macos</id>${nl3}<activation>${nl4}<os><family>mac</family></os>${nl3}</activation>${nl3}<properties>${nl4}<lwjgl.natives>natives-macos</lwjgl.natives>${nl3}</properties>${nl2}</profile>
\t\t<profile>${nl3}<id>lwjgl-natives-windows</id>${nl3}<activation>${nl4}<os><family>windows</family></os>${nl3}</activation>${nl3}<properties>${nl4}<lwjgl.natives>natives-windows</lwjgl.natives>${nl3}</properties>${nl2}</profile>
\t</profiles>\n\n`;
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
    (groupId, artifactId) =>
      `\n\t\t<dependency>${nl3}<groupId>${groupId}</groupId>${nl3}<artifactId>${artifactId}</artifactId>${nl3}<version>${v}</version>${nl2}</dependency>`,
    (groupId, artifactId) =>
      `\n\t\t<dependency>${nl3}<groupId>${groupId}</groupId>${nl3}<artifactId>${artifactId}</artifactId>${nl3}<version>${v}</version>${nl3}<classifier>${classifier}</classifier>${nl2}</dependency>`
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
