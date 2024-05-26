import { BuildType, Mode, NATIVE_ALL } from '../types';
import type { ScriptState } from '../BuildScript';
import type {
  Binding,
  BindingDefinition,
  BindingMapUnsafe,
  ModeDefinition,
  Native,
  PlatformSelection,
  Version,
} from '../types';
import { generateGradle } from './gradle';
import { generateIvy } from './ivy';
import { generateMaven } from './maven';

export async function copyToClipboard(ref: React.RefObject<HTMLPreElement | null>) {
  const pre = ref.current;
  if (pre === null) {
    return;
  }
  try {
    await navigator.clipboard.writeText(pre.innerText);
    alert('Script copied to clipboard.');
  } catch (err) {
    alert('Failed to copy script to clipboard.\n' + err.message);
  }
}

export function mime(mode: ModeDefinition) {
  return mode.file !== undefined && mode.file.endsWith('.xml') ? 'text/xml' : 'text/plain';
}

export function isNativeApplicableToAllPlatforms(artifact: BindingDefinition, platform: PlatformSelection): boolean {
  if (artifact.natives === undefined || artifact.nativesOptional !== true) {
    return true;
  }

  let applicablePlatforms = artifact.natives.filter((p) => platform[p]).length;
  return applicablePlatforms === 0 || applicablePlatforms === NATIVE_ALL.filter((p) => platform[p]).length;
}

export function getArtifactName(binding: BindingDefinition) {
  return binding.id === 'lwjgl' ? binding.id : binding.id.substring('lwjgl-'.length);
}

export function getVersion(version: Version, build: BuildType) {
  return build === BuildType.Release ? version : `${version}-SNAPSHOT`;
}

export function getSelectedPlatforms(natives: Array<Native>, platform: PlatformSelection): Native | null {
  let result = null;

  for (let i = 0; i < natives.length; i += 1) {
    const p = natives[i];
    if (platform[p]) {
      if (result === null) {
        result = p;
      } else {
        return null; // more than one platforms selected
      }
    }
  }

  return result;
}

export function getLinuxSuffix(platform: PlatformSelection): string {
  if (platform.linux) {
    return '';
  }
  if (platform['linux-arm64']) {
    return '-arm64';
  }
  if (platform['linux-arm32']) {
    return '-arm64';
  }
  if (platform['linux-ppc64le']) {
    return '-ppc64le';
  }
  if (platform['linux-riscv64']) {
    return '-riscv64';
  }
  throw 'no linux platform selected';
}

export function generateScript(mode: Mode, state: ScriptState): string {
  switch (mode) {
    case Mode.Maven:
      return generateMaven(state);
    case Mode.Gradle:
      return generateGradle(state);
    case Mode.Ivy:
      return generateIvy(state);
    default:
      throw 'Unsupported script mode';
  }
}

export function generateDependencies(
  selected: Array<Binding>,
  artifacts: BindingMapUnsafe,
  platform: PlatformSelection,
  osgi: boolean,
  generateJava: (
    artifact: BindingDefinition,
    groupId: string,
    artifactId: string,
    hasEnabledNativePlatform: boolean,
  ) => string,
  generateNative?: (artifact: BindingDefinition, groupId: string, artifactId: string) => string,
): string {
  let script = '';
  let nativesBundle = '';
  const groupId = osgi ? 'org.lwjgl.osgi' : 'org.lwjgl';

  selected.forEach((binding) => {
    let artifact = artifacts[binding];

    let hasEnabledNativePlatform = false;
    if (artifact.natives !== undefined) {
      hasEnabledNativePlatform = artifact.natives.some((it) => platform[it]);
      if (!hasEnabledNativePlatform && artifact.nativesOptional !== true) {
        return;
      }
    }

    const artifactId = osgi ? `org.lwjgl.${getArtifactName(artifact)}` : binding;
    script += generateJava(artifact, groupId, artifactId, hasEnabledNativePlatform);
    if (!osgi && hasEnabledNativePlatform && generateNative !== undefined) {
      nativesBundle += generateNative(artifact, groupId, artifactId);
    }
  });

  return script + nativesBundle;
}
