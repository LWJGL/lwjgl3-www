import { CSSContext } from '@emotion/core';

CSSContext.Provider._context._currentValue.stylis.use((context, content, selectors, parent, line, column, length) => {
  if (context === 1) {
    if (content.startsWith('custom-property') !== -1) {
      return 'background-color:red';
    }
  }

  return content;
});
