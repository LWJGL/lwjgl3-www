import { Fragment, Children } from 'react';
import { Flex } from './Flex';
import { styled } from '~/theme/stitches.config';

const Gap = styled('div', {
  flexGrow: 0,
  flexShrink: 0,
});

export interface StackProps {
  gap?: string | number;
}

const FlexStackDiv: FCC<StackProps> = ({ gap, children, ...rest }) => (
  <div {...rest}>
    {gap !== undefined
      ? Children.toArray(children).map((child, index, arr) => (
          <Fragment key={index}>
            {child}
            {index + 1 < arr.length ? <Gap css={{ flexBasis: gap }} /> : null}
          </Fragment>
        ))
      : children}
  </div>
);

export const FlexStack = styled(FlexStackDiv, Flex);

export const HStack = styled(FlexStack, {
  defaultVariants: {
    direction: 'horizontal',
  },
});

export const VStack = styled(FlexStack, {
  defaultVariants: {
    direction: 'vertical',
  },
});
