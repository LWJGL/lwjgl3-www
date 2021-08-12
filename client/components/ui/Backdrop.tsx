import { css } from '~/theme/stitches.config';
import { ZINDEX_MODAL_BACKDROP } from '~/theme';

export const getBackdropOpacity = (perc: number) => (perc > 0 ? `rgba(0,0,0,${perc * 0.75})` : 'rgba(0,0,0,0)');

export const BackdropCss = css({
  willChange: 'background-color',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    open: {
      true: {
        // backdropFilter: 'blur(3px)',
        pointerEvents: 'auto',
        position: 'fixed',
        zIndex: ZINDEX_MODAL_BACKDROP,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
  },
});
