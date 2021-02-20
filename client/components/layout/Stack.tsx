import { Fragment, Children } from 'react';
import { Grid } from './Grid';
import { styled } from '~/theme/stitches.config';

const DefaultDivider = styled('div', {
  backgroundColor: '$neutral100',
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
});

type StackGridType = typeof StackGrid;

export interface StackProps extends React.ComponentProps<StackGridType> {
  divider?: true | React.ReactNode;
}

export const Stack: React.FC<StackProps> = ({ children, divider, direction, ...props }) => (
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
