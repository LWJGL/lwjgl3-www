import { Fragment, Children } from 'react';
import { Grid } from './Grid';
import { styled } from '~/theme/stitches.config';

const DefaultDivider = styled('div', {
  backgroundColor: '$neutral3',
  variants: {
    direction: {
      horizontal: {
        width: 1,
        height: '100%',
      },
      vertical: {
        width: '100%',
        height: 1,
      },
    },
  },
  defaultVariants: {
    direction: 'horizontal',
  },
});

const StackGrid = styled(Grid, {
  variants: {
    direction: {
      vertical: {
        gridAutoFlow: 'row',
      },
      horizontal: {
        gridAutoFlow: 'column',
      },
    },
  },
  defaultVariants: {
    direction: 'horizontal',
  },
});

export interface StackProps {
  direction?: 'horizontal' | 'vertical';
  divider?: true | React.ReactNode;
}

// TODO: implement custom divider
export const Stack: FCC<StackProps> = ({ children, divider, direction, ...props }) => (
  <StackGrid direction={direction} {...props}>
    {divider !== undefined
      ? Children.toArray(children).map((child, index, arr) => (
          <Fragment key={index}>
            {child}
            {index + 1 < arr.length ? <DefaultDivider direction={direction} /> : null}
          </Fragment>
        ))
      : children}
  </StackGrid>
);
