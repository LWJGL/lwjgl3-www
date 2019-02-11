import { State } from '../BuildScript';
import { Addon, BindingDefinition, BuildType, Language, PlatformSelection } from '../types';
import { generateDependencies, getVersion, isNativeApplicableToAllPlatforms } from './script';

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
      script += `switch (OperatingSystem.current()) {`;
      if (platform.linux) {
        script += `
\tcase OperatingSystem.LINUX:
\t\tproject.ext.lwjglNatives = "natives-linux"
\t\tbreak`;
      }
      if (platform.macos) {
        script += `
\tcase OperatingSystem.MAC_OS:
\t\tproject.ext.lwjglNatives = "natives-macos"
\t\tbreak`;
      }
      if (platform.windows) {
        script += `
\tcase OperatingSystem.WINDOWS:
\t\tproject.ext.lwjglNatives = "natives-windows"
\t\tbreak`;
      }
      script += `
}\n\n`;
    } else {
      script += `val lwjglNatives = when (OperatingSystem.current()) {`;
      if (platform.linux) {
        script += `\n\tOperatingSystem.LINUX   -> "natives-linux"`;
      }
      if (platform.macos) {
        script += `\n\tOperatingSystem.MAC_OS  -> "natives-macos"`;
      }
      if (platform.windows) {
        script += `\n\tOperatingSystem.WINDOWS -> "natives-windows"`;
      }
      script += `
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
      (artifact, groupId, artifactId, hasEnabledNativePlatform) => `\n\timplementation "${groupId}:${artifactId}:${v}"`,
      (artifact, groupId, artifactId) =>
        `\n\t${guardNative(artifact, platform)}runtimeOnly "${groupId}:${artifactId}:${v}:${classifier}"`
    );

    selectedAddons.forEach((id: Addon) => {
      const {
        maven: { groupId, artifactId, version },
      } = addons[id];
      script += `\n\timplementation "${groupId}:${artifactId}:${hardcoded ? version : `\${${id}Version}`}"`;
    });
  } else {
    const v = hardcoded ? `"${versionString}"` : 'lwjglVersion';
    const classifier = !hardcoded || platformSingle == null ? 'lwjglNatives' : `"natives-${platformSingle}"`;
    script += generateDependencies(
      selected,
      artifacts,
      platform,
      osgi,
      (artifact, groupId, artifactId, hasEnabledNativePlatform) =>
        `\n\timplementation("${groupId}", "${artifactId}", ${v})`,
      (artifact, groupId, artifactId) =>
        `\n\t${guardNative(
          artifact,
          platform
        )}runtimeOnly("${groupId}", "${artifactId}", ${v}, classifier = ${classifier})`
    );

    selectedAddons.forEach((id: Addon) => {
      const {
        maven: { groupId, artifactId, version },
      } = addons[id];
      const v = id.indexOf('-') === -1 ? `${id}Version` : `\`${id}Version\``;
      script += `\n\timplementation("${groupId}", "${artifactId}", ${hardcoded ? `"${version}"` : v})`;
    });
  }

  script += `\n}`;

  return script;
}

function guardNative(artifact: BindingDefinition, platform: PlatformSelection) {
  return artifact.natives === undefined || isNativeApplicableToAllPlatforms(artifact, platform)
    ? ''
    : `if (${artifact.natives
        .filter(p => platform[p])
        .map(p => `lwjglNatives == "natives-${p}"`)
        .join(' || ')}) `;
}
