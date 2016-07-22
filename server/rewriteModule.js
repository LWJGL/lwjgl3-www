export default function replaceImport(originalPath, callingFileName, options) {
  if ( originalPath.indexOf('react-router/es6') !== -1 ) {
    return originalPath.replace('react-router/es6', 'react-router');
  }
  return originalPath;
}