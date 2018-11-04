// import { BUILD_RELEASE, BUILD_STABLE, MODE_ZIP, MODE_MAVEN, MODE_GRADLE, MODE_IVY } from './constants';
import { BuildConfig, LANGUAGES } from './types';
// import { RadioOptions } from '~/components/ControlledRadio';

/*
import {
  changePreset,
  changeLanguage,
  changeVersion,
  toggleHardcoded,
  toggleCompact,
  toggleJavadoc,
  toggleIncludeJSON,
  toggleOSGi,
  toggleDescriptions,
  toggleSource,
  changeMode,
} from './reducer';
*/

// const getMode = (state: State) => state.build.mode;
// const getBuild = (state: BuildConfig) => state.build;
// const getPreset = (state: State) => state.build.preset;
// const getLanguage = (state: State) => state.build.language;
// const getVersion = (state: State) => state.build.version;
export const isBuildSelected = (state: BuildConfig) => state.build !== null;
// export const hasLanguageOption = (state: State) => getMode(state) === MODE_GRADLE;
// const hasCompactModeOption = (state: State) => getMode(state) === MODE_MAVEN || getMode(state) === MODE_IVY;
// const isModeZip = (state: State) => getMode(state) === MODE_ZIP;
// const isModeNotZip = (state: State) => getMode(state) !== MODE_ZIP;
// export const isBuildRelease = (state: State) => state.build === BUILD_RELEASE;
// const showOSGi = (state: State) =>
//   isModeNotZip(state) && isBuildRelease(state) && parseInt(getVersion(state).replace(/\./g, ''), 10) >= 312;

/*
export const fields = {
  mode: {
    name: 'mode',
    value: getMode,
    action: changeMode,
    options: ({ build: { modes, build } }: State): RadioOptions =>
      modes.allIds.map(mode => ({
        value: mode,
        label: modes.byId[mode].title,
        disabled: build === BUILD_STABLE && mode !== MODE_ZIP,
      })),
  },
  preset: {
    name: 'preset',
    value: getPreset,
    action: changePreset,
    options: ({ build: { presets, preset } }: State): RadioOptions =>
      presets.allIds.map(presetId => ({
        value: presetId,
        label: presets.byId[presetId].title,
        disabled: preset !== presetId && presetId === 'custom',
      })),
  },
  language: {
    name: 'language',
    value: getLanguage,
    action: changeLanguage,
    options: ({ build: { languages } }: State): RadioOptions =>
      languages.allIds.map((lang: LANGUAGES) => ({
        value: lang,
        label: languages.byId[lang].title,
      })),
  },
  version: {
    name: 'version',
    value: getVersion,
    action: changeVersion,
    options: ({ build: { versions } }: State): RadioOptions =>
      versions.map(version => ({
        value: version,
        label: version,
        disabled: version === '3.0.0',
      })),
  },
  descriptions: {
    label: 'Show descriptions',
    checked: (state: State) => state.build.descriptions,
    action: toggleDescriptions,
  },
  source: {
    label: 'Include source',
    checked: (state: State) => state.build.source,
    action: toggleSource,
    hidden: isModeNotZip,
  },
  includeJSON: {
    label: 'Include build config',
    checked: (state: State) => state.build.includeJSON,
    action: toggleIncludeJSON,
    hidden: isModeNotZip,
  },
  javadoc: {
    label: 'Include JavaDoc',
    checked: (state: State) => state.build.javadoc,
    action: toggleJavadoc,
    hidden: isModeNotZip,
  },
  osgi: {
    label: 'OSGi Mode',
    checked: (state: State) => state.build.osgi,
    action: toggleOSGi,
    hidden: (state: State) => !showOSGi(state),
  },
  compact: {
    label: 'Compact Mode',
    checked: (state: State) => state.build.compact,
    action: toggleCompact,
    hidden: (state: State) => !hasCompactModeOption(state),
  },
  hardcoded: {
    label: 'Do not use variables',
    checked: (state: State) => state.build.hardcoded,
    action: toggleHardcoded,
    hidden: (state: State) => isModeZip(state),
  },
};
*/
