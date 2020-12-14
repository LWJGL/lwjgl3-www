import { styled } from '~/theme/stitches.config';

export const Hr = styled('hr', {
  variants: {
    margin: {
      none: {
        //
      },
      auto: {
        my: '$paragraph',
      },
      sm: {
        my: '$sm',
      },
      lg: {
        my: '$gap',
      },
      xl: {
        my: '$safe',
      },
    },
  },
});

//@ts-ignore
Hr.defaultProps = {
  margin: 'auto',
};
