import { ScriptState } from '../BuildScript';
import { BuildType } from '../types';
import type { Addon } from '../types';
import {
  generateDependencies,
  getArtifactName,
  getLinuxSuffix,
  getVersion,
  isNativeApplicableToAllPlatforms,
} from './script';

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
}: ScriptState) {
  const versionString = getVersion(version, build);
  let script = '';
  const v = hardcoded ? versionString : '${lwjgl.version}';
  const nl1 = compact ? '' : '\n';
  const nl2 = compact ? '' : '\n\t';
  const nl3 = compact ? '' : '\n\t\t';
  const classifier = !hardcoded || platformSingle == null ? '${lwjgl.natives}' : `natives-${platformSingle}`;

  if (!hardcoded || build !== BuildType.Release) script += `<!-- Add to ivysettings.xml -->\n`;

  if (!hardcoded) {
    script += `<property name="lwjgl.version" value="${versionString}"/>`;

    selectedAddons.forEach((id: Addon) => {
      script += `\n<property name="${id}.version" value="${addons[id].maven.version}"/>`;
    });

    if (platformSingle !== null) {
      script += `\n<property name="lwjgl.natives" value="natives-${platformSingle}"/>`;
    }
    script += '\n\n';
  }

  if (build !== BuildType.Release) {
    script += `<settings defaultResolver="maven-with-snapshots"/>
<resolvers>
\t<chain name="maven-with-snapshots">
\t\t<ibiblio name="sonatype-snapshots" m2compatible="true" root="https://oss.sonatype.org/content/repositories/snapshots/"/>
\t\t<ibiblio name="maven-central" m2compatible="true"/>
\t</chain>
</resolvers>\n\n`;
  }

  if (platformSingle === null) {
    script += `<!-- Add to build.xml -->`;
    if (platform.freebsd) {
      script += `
<condition property="lwjgl.natives" value="natives-freebsd">${nl2}<os name="FreeBSD"/>${nl1}</condition>`;
    }
    const linuxArches =
      +platform['linux'] +
      +platform['linux-arm64'] +
      +platform['linux-arm32'] +
      +platform['linux-ppc64le'] +
      +platform['linux-riscv64'];
    if (linuxArches !== 0) {
      if (linuxArches === 1) {
        script += `
<condition property="lwjgl.natives" value="natives-linux${getLinuxSuffix(
          platform,
        )}">${nl2}<os name="Linux"/>${nl1}</condition>`;
      } else {
        if (platform.linux) {
          script += `
<condition property="lwjgl.natives" value="natives-linux">
\t<and>
\t\t<os name="Linux"/>
\t\t<not><matches string="\${os.arch}" pattern="^(arm|aarch64|ppc|riscv)"/></not>
\t</and>
</condition>`;
        }
        if (platform['linux-arm64']) {
          script += `
<condition property="lwjgl.natives" value="natives-linux-arm64">
\t<and>
\t\t<os name="Linux"/>
\t\t<matches string="\${os.arch}" pattern="^(arm|aarch64)"/>
\t\t<matches string="\${os.arch}" pattern="64|^armv8"/>
\t</and>
</condition>`;
        }
        if (platform['linux-arm32']) {
          script += `
<condition property="lwjgl.natives" value="natives-linux-arm32">
\t<and>
\t\t<os name="Linux"/>
\t\t<matches string="\${os.arch}" pattern="^arm"/>
\t\t<not><matches string="\${os.arch}" pattern="64|^armv8"/></not>
\t</and>
</condition>`;
        }
        if (platform['linux-ppc64le']) {
          script += `
<condition property="lwjgl.natives" value="natives-linux-ppc64le">
\t<and>
\t\t<os name="Linux"/>
\t\t<matches string="\${os.arch}" pattern="^ppc"/>
\t</and>
</condition>`;
        }
        if (platform['linux-riscv64']) {
          script += `
<condition property="lwjgl.natives" value="natives-linux-riscv64">
\t<and>
\t\t<os name="Linux"/>
\t\t<matches string="\${os.arch}" pattern="^riscv"/>
\t</and>
</condition>`;
        }
      }
    }
    const macosArches = +platform.macos + +platform['macos-arm64'];
    if (macosArches !== 0) {
      if (macosArches === 1) {
        script += `
<condition property="lwjgl.natives" value="natives-macos${
          platform.macos ? '' : '-arm64'
        }">${nl2}<os name="Mac OS X"/>${nl1}</condition>`;
      } else {
        if (platform.macos) {
          script += `
<condition property="lwjgl.natives" value="natives-macos">
\t<and>
\t\t<os name="Mac OS X"/>
\t\t<not><matches string="\${os.arch}" pattern="aarch64"/></not>
\t</and>
</condition>`;
        }
        if (platform['macos-arm64']) {
          script += `
<condition property="lwjgl.natives" value="natives-macos-arm64">
\t<and>
\t\t<os name="Mac OS X"/>
\t\t<matches string="\${os.arch}" pattern="aarch64"/>
\t</and>
</condition>`;
        }
      }
    }
    const windowsArches = +platform.windows + +platform['windows-x86'] + +platform['windows-arm64'];
    if (windowsArches !== 0) {
      if (windowsArches === 1) {
        script += `
<condition property="lwjgl.natives" value="natives-windows${
          platform.windows ? '' : platform['windows-arm64'] ? '-arm64' : '-x86'
        }">${nl2}<os family="Windows"/>${nl1}</condition>`;
      } else {
        if (platform.windows) {
          script += `
<condition property="lwjgl.natives" value="natives-windows">
\t<and>
\t\t<os family="Windows"/>
\t\t<matches string="\${os.arch}" pattern="64"/>
\t\t<not><matches string="\${os.arch}" pattern="aarch64"/></not>
\t</and>
</condition>`;
        }
        if (platform['windows-x86']) {
          script += `
<condition property="lwjgl.natives" value="natives-windows-x86">
\t<and>
\t\t<os family="Windows"/>
\t\t<not><matches string="\${os.arch}" pattern="64"/></not>
\t</and>
</condition>`;
        }
        if (platform['windows-arm64']) {
          script += `
<condition property="lwjgl.natives" value="natives-windows-arm64">
\t<and>
\t\t<os family="Windows"/>
\t\t<matches string="\${os.arch}" pattern="aarch64"/>
\t</and>
</condition>`;
        }
      }
    }
    let classifierOverrides = selected
      .filter((binding) => !isNativeApplicableToAllPlatforms(artifacts[binding], platform))
      .map((binding) => {
        let artifact = artifacts[binding];
        if (artifact.natives === undefined) {
          // cannot happen
          return '';
        }

        let predicates = artifact.natives
          .filter((p) => platform[p])
          .map((p) => `<equals arg1="\${lwjgl.natives}" arg2="native-${p}"/>`);

        return `\t<condition property="lwjgl.natives.${getArtifactName(
          artifact,
        )}" value="\${lwjgl.natives}" else="">${nl2}${
          predicates.length === 1 ? predicates : `<or>${nl3}${predicates.join(nl3)}${nl2}</or>`
        }${nl1}</condition>`;
      })
      .join(nl3);
    if (classifierOverrides.length !== 0) {
      script += `\n${classifierOverrides}`;
    }
    script += `\n\n`;
  }

  script += `<!-- Add to ivy.xml (xmlns:m="http://ant.apache.org/ivy/maven") -->
<dependencies>`;
  script += generateDependencies(
    selected,
    artifacts,
    platform,
    osgi,
    (artifact, groupId, artifactId, hasEnabledNativePlatform) =>
      `\n\t<dependency org="${groupId}" name="${artifactId}" rev="${v}"${
        hasEnabledNativePlatform
          ? `>${nl3}<artifact name="${artifactId}" type="jar"/>${nl3}<artifact name="${artifactId}" type="jar" m:classifier="${
              isNativeApplicableToAllPlatforms(artifact, platform)
                ? classifier
                : `\${lwjgl.natives.${getArtifactName(artifact)}}`
            }"/>${nl2}</dependency>`
          : '/>'
      }`,
  );

  selectedAddons.forEach((id: Addon) => {
    const {
      maven: { groupId, artifactId, version },
    } = addons[id];
    script += `\n\t<dependency org="${groupId}" name="${artifactId}" rev="${
      hardcoded ? version : `\${${id}.version}`
    }"/>`;
  });

  script += `\n</dependencies>`;

  return script;
}
