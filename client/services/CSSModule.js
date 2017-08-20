// @flow
export type CSSModule = {
  use: () => void,
  unuse: () => void,
};

const css: CSSModule = {
  use: function() {},
  unuse: function() {},
};

module.exports = css;
