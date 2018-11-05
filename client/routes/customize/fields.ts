// import { BUILD_RELEASE, BUILD_STABLE, MODE_ZIP, MODE_MAVEN, MODE_GRADLE, MODE_IVY } from './constants';
import { BuildStore, Language, Mode, BuildType } from './types';
import { RadioOptions } from './ControlledRadio';
import {
  selectMode,
  selectLanguage,
  selectVersion,
  toggleDescriptions,
  toggleSource,
  toggleIncludeJSON,
  toggleJavadoc,
  toggleOSGi,
  toggleCompact,
  toggleHardcoded,
  selectPreset,
} from './actions';

const getMode = (state: BuildStore) => state.mode;
const getPreset = (state: BuildStore) => state.preset;
const getLanguage = (state: BuildStore) => state.language;
const getVersion = (state: BuildStore) => state.version;
export const isBuildSelected = (state: BuildStore) => state.build !== null;
export const hasLanguageOption = (state: BuildStore) => state.mode === Mode.Gradle;
const hasCompactModeOption = (state: BuildStore) => state.mode === Mode.Maven || state.mode === Mode.Ivy;
const isModeZip = (state: BuildStore) => state.mode === Mode.Zip;
const isModeNotZip = (state: BuildStore) => state.mode !== Mode.Zip;
export const isBuildRelease = (state: BuildStore) => state.build === BuildType.Release;
const showOSGi = (state: BuildStore) =>
  state.mode !== Mode.Zip && state.build === BuildType.Release && parseInt(state.version.replace(/\./g, ''), 10) >= 312;

export const fields = {
  mode: {
    name: 'mode',
    value: getMode,
    action: selectMode,
    options: ({ build, modes }: BuildStore): RadioOptions =>
      modes.allIds.map(mode => ({
        value: mode,
        label: modes.byId[mode].title,
        disabled: build === BuildType.Stable && mode !== Mode.Zip,
      })),
  },
  preset: {
    name: 'preset',
    value: getPreset,
    action: selectPreset,
    options: ({ presets, preset }: BuildStore): RadioOptions =>
      presets.allIds.map(presetId => ({
        value: presetId,
        label: presets.byId[presetId].title,
        disabled: preset !== presetId && presetId === 'custom',
      })),
  },
  language: {
    name: 'language',
    value: getLanguage,
    action: selectLanguage,
    options: ({ languages }: BuildStore): RadioOptions =>
      languages.allIds.map((lang: Language) => ({
        value: lang,
        label: languages.byId[lang].title,
      })),
  },
  version: {
    name: 'version',
    value: getVersion,
    action: selectVersion,
    options: ({ versions }: BuildStore): RadioOptions =>
      versions.map(version => ({
        value: version,
        label: version,
        disabled: version === '3.0.0',
      })),
  },
  descriptions: {
    label: 'Show descriptions',
    checked: (state: BuildStore) => state.descriptions,
    action: toggleDescriptions,
  },
  source: {
    label: 'Include source',
    checked: (state: BuildStore) => state.source,
    action: toggleSource,
    hidden: isModeNotZip,
  },
  includeJSON: {
    label: 'Include build config',
    checked: (state: BuildStore) => state.includeJSON,
    action: toggleIncludeJSON,
    hidden: isModeNotZip,
  },
  javadoc: {
    label: 'Include JavaDoc',
    checked: (state: BuildStore) => state.javadoc,
    action: toggleJavadoc,
    hidden: isModeNotZip,
  },
  osgi: {
    label: 'OSGi Mode',
    checked: (state: BuildStore) => state.osgi,
    action: toggleOSGi,
    hidden: (state: BuildStore) => !showOSGi(state),
  },
  compact: {
    label: 'Compact Mode',
    checked: (state: BuildStore) => state.compact,
    action: toggleCompact,
    hidden: (state: BuildStore) => !hasCompactModeOption(state),
  },
  hardcoded: {
    label: 'Do not use variables',
    checked: (state: BuildStore) => state.hardcoded,
    action: toggleHardcoded,
    hidden: (state: BuildStore) => isModeZip(state),
  },
};
