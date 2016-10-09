import * as $ from './actionTypes'

export const changeType = type => ({type: $.SELECT_TYPE, build: type});
export const changeMode = mode => ({type: $.SELECT_MODE, mode});
export const changePreset = preset => ({type: $.SELECT_PRESET, preset});
export const changeLanguage = language => ({type: $.SELECT_LANGUAGE, language});
export const changeVersion = version => ({type: $.SELECT_VERSION, version});

export const toggleDescriptions = enabled => ({type: $.TOGGLE_DESCRIPTIONS, descriptions: enabled});
export const toggleSource = enabled => ({type: $.TOGGLE_SOURCE, source: enabled});
export const toggleJavadoc = enabled => ({type: $.TOGGLE_JAVADOC, javadoc: enabled});
export const toggleCompact = enabled => ({type: $.TOGGLE_COMPACT, compact: enabled});
export const toggleHardcoded = enabled => ({type: $.TOGGLE_HARDCODED, hardcoded: enabled});
export const toggleArtifact = (artifact, enabled) => ({type: $.TOGGLE_ARTIFACT, artifact, enabled});
export const togglePlatform = platform => ({type: $.TOGGLE_PLATFORM, platform});

// export const errorSet = (message, severity="danger") => ({type: $.ERROR_SET, error: { message, severity }});
// export const errorReset = () => ({type: $.ERROR_SET, error: null});

export const downloadInit = () => ({type: $.DOWNLOAD_INIT});
export const downloadComplete = error => ({type: $.DOWNLOAD_COMPLETE, error});
export const downloadLog = payload => ({type: $.DOWNLOAD_LOG, payload});

export const reset = () => ({type: $.RESET});
