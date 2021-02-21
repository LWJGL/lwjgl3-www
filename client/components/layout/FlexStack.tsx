import { Fragment, Children } from 'react';
import { Flex } from './Flex';
import { styled } from '~/theme/stitches.config';

// Types
type FlexType = typeof Flex;
export interface StackProps extends React.ComponentProps<FlexType> {
  gap?: string | number;
}
type HVStackProps = Omit<StackProps, 'direction'>;

const Gap = styled('div', {
  flexGrow: 0,
  flexShrink: 0,
});

export const FlexStack: React.FC<StackProps> = ({ gap, children, ...rest }) => (
  <Flex {...rest}>
    {gap !== undefined
      ? Children.toArray(children).map((child, index, arr) => (
          <Fragment key={index}>
            {child}
            {index + 1 < arr.length ? <Gap css={{ flexBasis: gap }} /> : null}
          </Fragment>
        ))
      : children}
  </Flex>
);

export const HStack: React.FC<HVStackProps> = (props) => <FlexStack direction="horizontal" {...props} />;

export const VStack: React.FC<HVStackProps> = (props) => <FlexStack direction="vertical" {...props} />;
