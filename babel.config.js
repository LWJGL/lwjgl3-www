const ReactCompilerConfig = {
  // compilationMode: 'annotation',
};

module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
      '@babel/plugin-syntax-jsx',
      ['@babel/plugin-syntax-typescript', { isTSX: true }],
    ],
  };
};
