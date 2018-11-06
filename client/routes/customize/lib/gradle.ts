import { State } from '../BuildScript';
import { Addon, BuildType, Language } from '../types';
import { generateDependencies, getVersion } from './script';

export function generateGradle({
  build,
  version,
  hardcoded,
  osgi,
  language,
  artifacts,
  platform,
  platformSingle,
  selected,
  addons,
  selectedAddons,
}: State) {
  const versionString = getVersion(version, build);

  let script = platformSingle === null ? 'import org.gradle.internal.os.OperatingSystem\n\n' : '';

  if (!hardcoded) {
    if (language === Language.Groovy) {
      script += `project.ext.lwjglVersion = "${versionString}"`;
      selectedAddons.forEach((id: Addon) => {
        script += `\nproject.ext.${id}Version = "${addons[id].maven.version}"`;
      });
      if (platformSingle !== null) {
        script += `\nproject.ext.lwjglNatives = "natives-${platformSingle}"`;
      }
    } else {
      script += `val lwjglVersion = "${versionString}"`;
      selectedAddons.forEach((id: Addon) => {
        const v = id.indexOf('-') === -1 ? `${id}Version` : `\`${id}Version\``;
        script += `\nval ${v} = "${addons[id].maven.version}"`;
      });
      if (platformSingle !== null) {
        script += `\nval lwjglNatives = "natives-${platformSingle}"`;
      }
    }

    script += '\n\n';
  }
  if (platformSingle === null) {
    if (language === Language.Groovy) {
      script += `switch ( OperatingSystem.current() ) {
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
    } else {
      script += `val lwjglNatives = when (OperatingSystem.current()) {
\tOperatingSystem.LINUX   -> "natives-linux"
\tOperatingSystem.MAC_OS  -> "natives-macos"
\tOperatingSystem.WINDOWS -> "natives-windows"
\telse -> throw Error("Unrecognized or unsupported Operating system. Please set \\"lwjglNatives\\" manually")
}\n\n`;
    }
  }

  script += `repositories {
\tmavenCentral()`;
  if (build !== BuildType.Release) {
    if (language === Language.Groovy) {
      script += `\n\tmaven { url "https://oss.sonatype.org/content/repositories/snapshots/" }`;
    } else {
      script += `\n\tmaven("https://oss.sonatype.org/content/repositories/snapshots/")`;
    }
  }
  script += `
}

dependencies {`;

  if (language === Language.Groovy) {
    const v = hardcoded ? versionString : '$lwjglVersion';
    const classifier = !hardcoded || platformSingle == null ? '$lwjglNatives' : `natives-${platformSingle}`;
    script += generateDependencies(
      selected,
      artifacts,
      platform,
      osgi,
      (groupId, artifactId, hasEnabledNativePlatform) => `\n\tcompile "${groupId}:${artifactId}:${v}"`,
      (groupId, artifactId) => `\n\tcompile "${groupId}:${artifactId}:${v}:${classifier}"`
    );

    selectedAddons.forEach((id: Addon) => {
      const {
        maven: { groupId, artifactId, version },
      } = addons[id];
      script += `\n\tcompile "${groupId}:${artifactId}:${hardcoded ? version : `\${${id}Version}`}"`;
    });
  } else {
    const v = hardcoded ? `"${versionString}"` : 'lwjglVersion';
    const classifier = !hardcoded || platformSingle == null ? 'lwjglNatives' : `"natives-${platformSingle}"`;
    script += generateDependencies(
      selected,
      artifacts,
      platform,
      osgi,
      (groupId, artifactId, hasEnabledNativePlatform) => `\n\t"compile"("${groupId}", "${artifactId}", ${v})`,
      (groupId, artifactId) => `\n\t"compile"("${groupId}", "${artifactId}", ${v}, classifier = ${classifier})`
    );

    selectedAddons.forEach((id: Addon) => {
      const {
        maven: { groupId, artifactId, version },
      } = addons[id];
      const v = id.indexOf('-') === -1 ? `${id}Version` : `\`${id}Version\``;
      script += `\n\t"compile"("${groupId}", "${artifactId}", ${hardcoded ? `"${version}"` : v})`;
    });
  }

  script += `\n}`;

  return script;
}
