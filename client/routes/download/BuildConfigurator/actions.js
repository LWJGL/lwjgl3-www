import * as $ from './actionTypes';

export const changeType = (type: string) => ({ type: $.SELECT_TYPE, build: type });
export const changeMode = (mode: string) => ({ type: $.SELECT_MODE, mode });
export const changePreset = (preset: string) => ({ type: $.SELECT_PRESET, preset });
export const changeLanguage = (language: string) => ({ type: $.SELECT_LANGUAGE, language });
export const changeVersion = (version: string) => ({ type: $.SELECT_VERSION, version });

export const toggleDescriptions = (enabled: boolean) => ({ type: $.TOGGLE_DESCRIPTIONS, descriptions: enabled });
export const toggleSource = (enabled: boolean) => ({ type: $.TOGGLE_SOURCE, source: enabled });
export const toggleJavadoc = (enabled: boolean) => ({ type: $.TOGGLE_JAVADOC, javadoc: enabled });
export const toggleCompact = (enabled: boolean) => ({ type: $.TOGGLE_COMPACT, compact: enabled });
export const toggleHardcoded = (enabled: boolean) => ({ type: $.TOGGLE_HARDCODED, hardcoded: enabled });
export const toggleArtifact = (artifact: string) => ({ type: $.TOGGLE_ARTIFACT, artifact });
export const togglePlatform = (platform: string) => ({ type: $.TOGGLE_PLATFORM, platform });
export const toggleAddon = (addon: string) => ({ type: $.TOGGLE_ADDON, addon });

export const downloadInit = () => ({ type: $.DOWNLOAD_INIT });
export const downloadComplete = (error: string) => ({ type: $.DOWNLOAD_COMPLETE, error });
export const downloadLog = (payload: {}) => ({ type: $.DOWNLOAD_LOG, payload });

export const configLoad = (payload: {}) => ({ type: $.CONFIG_LOAD, payload });
export const configDownload = () => ({ type: $.CONFIG_DOWNLOAD });

export const reset = () => ({ type: $.RESET });
