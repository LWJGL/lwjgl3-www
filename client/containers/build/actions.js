import * as $ from './actionTypes'

export const changeType = type => ({type: $.SELECT_TYPE, build: type});
export const changeMode = mode => ({type: $.SELECT_MODE, mode});

export const toggleDescriptions = enabled => ({type: $.TOGGLE_DESCRIPTIONS, descriptions: enabled});
export const toggleSource = enabled => ({type: $.TOGGLE_SOURCE, source: enabled});
export const toggleJavadoc = enabled => ({type: $.TOGGLE_JAVADOC, javadoc: enabled});
export const toggleCompact = enabled => ({type: $.TOGGLE_COMPACT, compact: enabled});
export const toggleHardcoded = enabled => ({type: $.TOGGLE_HARDCODED, hardcoded: enabled});

export const errorSet = (message, severity="danger") => ({type: $.ERROR_SET, error: { message, severity }});
export const errorReset = () => ({type: $.ERROR_SET, error: null});
