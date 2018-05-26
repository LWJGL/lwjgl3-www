// @flow
import { BUILD_RELEASE, BUILD_STABLE, MODE_ZIP, MODE_MAVEN, MODE_GRADLE, MODE_IVY } from './constants';
import type { BuildConfig, LANGUAGES } from './types';

import {
  changePreset,
  changeLanguage,
  changeVersion,
  toggleHardcoded,
  toggleCompact,
  toggleJavadoc,
  toggleOSGi,
  toggleDescriptions,
  toggleSource,
  changeMode,
} from './reducer';

type State = {
  build: BuildConfig,
};

const getMode = (state: State) => state.build.mode;
const getBuild = (state: State) => state.build.build;
const getPreset = (state: State) => state.build.preset;
const getLanguage = (state: State) => state.build.language;
const getVersion = (state: State) => state.build.version;
export const isBuildSelected = (state: State) => getBuild(state) !== null;
export const hasLanguageOption = (state: State) => getMode(state) === MODE_GRADLE;
const hasCompactModeOption = (state: State) => getMode(state) === MODE_MAVEN || getMode(state) === MODE_IVY;
const isModeZip = (state: State) => getMode(state) === MODE_ZIP;
const isModeNotZip = (state: State) => getMode(state) !== MODE_ZIP;
export const isBuildRelease = (state: State) => getBuild(state) === BUILD_RELEASE;
const showOSGi = (state: State) =>
  isModeNotZip(state) && isBuildRelease(state) && parseInt(getVersion(state).replace(/\./g, ''), 10) >= 312;

export const fields = {
  mode: {
    name: 'mode',
    value: getMode,
    action: changeMode,
    options: ({ build: { modes, build } }: State) =>
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
    options: ({ build: { presets, preset } }: State) =>
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
    options: ({ build: { languages } }: State) =>
      languages.allIds.map((lang: LANGUAGES) => ({
        value: lang,
        label: languages.byId[lang].title
      })),
  },
  version: {
    name: 'version',
    value: getVersion,
    action: changeVersion,
    options: ({ build: { versions } }: State) =>
      versions.map(version => {
        return {
          value: version,
          label: version,
          disabled: version === '3.0.0',
        };
      }),
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
