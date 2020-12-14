import { Fragment, Children } from 'react';
import { Grid } from './Grid';
import { styled } from '~/theme/stitches.config';

export interface StackProps extends React.ComponentProps<typeof Grid> {
  direction?: 'vertical' | 'horizontal';
  divider?: true | React.ReactNode;
}

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

export const Stack: React.FC<StackProps> = ({ direction = 'vertical', css, divider, children, ...rest }) => (
  <Grid
    css={{
      gridAutoFlow: direction === 'vertical' ? 'row' : 'column',
      //@ts-expect-error
      ...css,
    }}
    {...rest}
  >
    {divider !== undefined
      ? Children.map(children, (child: React.ReactChild, index: number) => (
          <Fragment key={index}>
            {child}
            {index + 1 < children.length ? <DefaultDivider direction={direction} /> : null}
          </Fragment>
        ))
      : children}
  </Grid>
);
