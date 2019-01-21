import { useMemo } from 'react';
import { State } from '../BuildScript';
import {
  Binding,
  BindingMapUnsafe,
  BuildType,
  Mode,
  ModeDefinition,
  Native,
  PlatformSelection,
  Version,
} from '../types';
import { generateGradle } from './gradle';
import { generateIvy } from './ivy';
import { generateMaven } from './maven';

export function copyToClipboard(ref: React.RefObject<HTMLElement>) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    selection.removeAllRanges();
  }
  const range = document.createRange();
  const pre = ref.current;
  if (pre === null) {
    return;
  }
  range.selectNode(pre);
  selection.addRange(range);
  document.execCommand('copy');
  selection.removeAllRanges();
  alert('Script copied to clipboard.');
}

export function mime(mode: ModeDefinition) {
  return mode.file !== undefined && mode.file.endsWith('.xml') ? 'text/xml' : 'text/plain';
}

export function getVersion(version: Version, build: BuildType) {
  return build === BuildType.Release ? version : `${version}-SNAPSHOT`;
}

export function getSelectedPlatforms(natives: Array<Native>, platform: PlatformSelection): Native | null {
  return useMemo(() => {
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
  }, [platform]);
}

export function generateScript(mode: Mode, state: State): string {
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
  generateJava: (groupId: string, artifactId: string, hasEnabledNativePlatform: boolean) => string,
  generateNative: (groupId: string, artifactId: string) => string
): string {
  let script = '';
  let nativesBundle = '';
  const groupId = osgi ? 'org.lwjgl.osgi' : 'org.lwjgl';

  selected.forEach(artifact => {
    let natives = artifacts[artifact].natives;
    let hasEnabledNativePlatform = natives !== undefined && natives.some(it => platform[it]);
    if (natives !== undefined && !hasEnabledNativePlatform && artifacts[artifact].nativesOptional !== true) {
      return;
    }
    const artifactId = osgi
      ? `org.lwjgl.${artifact === 'lwjgl' ? artifact : artifact.substring('lwjgl-'.length)}`
      : artifact;
    script += generateJava(groupId, artifactId, hasEnabledNativePlatform);
    if (!osgi && hasEnabledNativePlatform) {
      nativesBundle += generateNative(groupId, artifactId);
    }
  });

  return script + nativesBundle;
}
