// @flow
import { StyleSheet } from 'aphrodite/no-important';

export default StyleSheet.create({
  folder: {
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      backgroundColor: '#5bc0de',
      color: 'white',
    },
  },
  file: {
    wordBreak: 'break-all',
  },
});
