// @flow

import { createSelector } from 'reselect';
import { BUILD_RELEASE, BUILD_STABLE, MODE_ZIP, MODE_MAVEN, MODE_GRADLE, MODE_IVY } from './constants';
import type { BuildConfig, LANGUAGES } from './types';

import {
  default as reducer,
  configLoad,
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

export default {
  mode: {
    name: 'mode',
    value: getMode,
    action: changeMode,
    options: createSelector(
      (state: State) => state.build.modes,
      (state: State) => state.build.build,
      (modes, build) => {
        return modes.allIds.map(mode => ({
          value: mode,
          label: modes.byId[mode].title,
          disabled: build === BUILD_STABLE && mode !== MODE_ZIP,
        }));
      }
    ),
  },
  preset: {
    name: 'preset',
    value: getPreset,
    action: changePreset,
    options: createSelector(
      (state: State) => state.build.presets,
      presets =>
        presets.allIds.map(preset => ({
          value: preset,
          label: presets.byId[preset].title,
        }))
    ),
  },
  language: {
    name: 'language',
    value: getLanguage,
    action: changeLanguage,
    options: createSelector(
      (state: State) => state.build.languages,
      languages =>
        languages.allIds.map((lang: LANGUAGES) => ({
          value: lang,
          label: languages.byId[lang].title,
          disabled: lang !== 'groovy',
        }))
    ),
  },
  version: {
    name: 'version',
    value: getVersion,
    action: changeVersion,
    options: createSelector(
      (state: State) => state.build.versions,
      versions =>
        versions.map(version => {
          return {
            value: version,
            label: version,
            disabled: version === '3.0.0',
          };
        })
    ),
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
