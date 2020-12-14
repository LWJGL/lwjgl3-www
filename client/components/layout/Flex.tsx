import { styled } from '../../theme/stitches.config';

export const Flex = styled('div', {
  display: 'flex',
  variants: {
    direction: {
      horizontal: {
        flexDirection: 'row',
      },
      vertical: {
        flexDirection: 'column',
      },
    },
    justify: {
      start: {
        justifyContent: 'flex-start',
      },
      end: {
        justifyContent: 'flex-end',
      },
      center: {
        justifyContent: 'center',
      },
      spaceAround: {
        justifyContent: 'space-around',
      },
      spaceBetween: {
        justifyContent: 'space-between',
      },
      spaceEvenly: {
        justifyContent: 'space-evenly',
      },
      stretch: {
        justifyContent: 'stretch',
      },
    },
    align: {
      start: {
        alignItems: 'flex-start',
      },
      end: {
        alignItems: 'flex-end',
      },
      center: {
        alignItems: 'center',
      },
      stretch: {
        alignItems: 'stretch',
      },
      baseline: {
        alignItems: 'baseline',
      },
      firstBaseline: {
        alignItems: 'first baseline',
      },
      lastBaseline: {
        alignItems: 'last baseline',
      },
    },
    wrap: {
      nowrap: {
        flexWrap: 'nowrap',
      },
      wrap: {
        flexWrap: 'wrap',
      },
      wrapReverse: {
        flexWrap: 'wrap-reverse',
      },
    },
    width: {
      full: {
        width: '100%',
      },
    },
  },
});

//@ts-ignore
Flex.defaultProps = {
  direction: 'horizontal',
  justify: 'start',
  align: 'start',
  wrap: 'nowrap',
};
