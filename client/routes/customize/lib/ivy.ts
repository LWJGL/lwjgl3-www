import { State } from '../BuildScript';
import { Addon, BuildType } from '../types';
import { generateDependencies, getVersion } from './script';

export function generateIvy({
  build,
  version,
  hardcoded,
  osgi,
  compact,
  artifacts,
  platform,
  platformSingle,
  selected,
  addons,
  selectedAddons,
}: State) {
  const versionString = getVersion(version, build);
  let script = '';
  const v = hardcoded ? versionString : '${lwjgl.version}';
  const nl1 = compact ? '' : '\n\t';
  const nl2 = compact ? '' : '\n\t\t';
  const nl3 = compact ? '' : '\n\t\t\t';
  const classifier = !hardcoded || platformSingle == null ? '${lwjgl.natives}' : `natives-${platformSingle}`;

  if (!hardcoded || build !== BuildType.Release) script += `\t<!-- Add to ivysettings.xml -->\n`;

  if (!hardcoded) {
    script += `\t<property name="lwjgl.version" value="${versionString}"/>`;

    selectedAddons.forEach((id: Addon) => {
      script += `\n\t<property name="${id}.version" value="${addons[id].maven.version}"/>`;
    });

    if (platformSingle !== null) {
      script += `\n\t<property name="lwjgl.natives" value="natives-${platformSingle}"/>`;
    }
    script += '\n\n';
  }

  if (build !== BuildType.Release) {
    script += `\t<settings defaultResolver="maven-with-snapshots"/>
\t<resolvers>
\t\t<chain name="maven-with-snapshots">
\t\t\t<ibiblio name="sonatype-snapshots" m2compatible="true" root="https://oss.sonatype.org/content/repositories/snapshots/"/>
\t\t\t<ibiblio name="maven-central" m2compatible="true"/>
\t\t</chain>
\t</resolvers>\n\n`;
  }

  if (platformSingle === null) {
    script += `\t<!-- Add to build.xml -->
\t<condition property="lwjgl.natives" value="natives-linux">${nl2}<os name="Linux"/>${nl1}</condition>
\t<condition property="lwjgl.natives" value="natives-macos">${nl2}<os name="Mac OS X"/>${nl1}</condition>
\t<condition property="lwjgl.natives" value="natives-windows">${nl2}<os family="Windows"/>${nl1}</condition>\n\n`;
  }

  script += `\t<!-- Add to ivy.xml (xmlns:m="http://ant.apache.org/ivy/maven") -->
\t<dependencies>`;

  script += generateDependencies(
    selected,
    artifacts,
    platform,
    osgi,
    (groupId, artifactId, hasEnabledNativePlatform) =>
      hasEnabledNativePlatform
        ? `\n\t\t<dependency org="${groupId}" name="${artifactId}" rev="${v}">${nl3}<artifact name="${artifactId}" type="jar"/>${nl3}<artifact name="${artifactId}" type="jar" m:classifier="${classifier}"/>${nl2}</dependency>`
        : `\n\t\t<dependency org="${groupId}" name="${artifactId}" rev="${v}"/>`,
    () => ''
  );

  selectedAddons.forEach((id: Addon) => {
    const {
      maven: { groupId, artifactId, version },
    } = addons[id];
    script += `\n\t\t<dependency org="${groupId}" name="${artifactId}" rev="${
      hardcoded ? version : `\${${id}.version}`
    }"/>`;
  });

  script += `\n\t</dependencies>`;

  return script;
}
