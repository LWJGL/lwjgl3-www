import { Fragment, Children } from 'react';
import { Flex } from './Flex';
import { Box } from './Box';

// Types
export interface StackProps extends React.ComponentProps<typeof Flex> {
  gap?: string | number;
}
type HVStackProps = Omit<StackProps, 'direction'>;

const Gap: React.FC<{ gap: string | number }> = ({ gap }) => {
  return <Box css={{ flexGrow: 0, flexShrink: 0, flexBasis: gap }} />;
};

export const Stack: React.FC<StackProps> = ({ gap, children, ...rest }) => (
  <Flex {...rest}>
    {gap !== undefined
      ? Children.map(children, (child: React.ReactChild, index: number) => (
          <Fragment key={index}>
            {child}
            {index + 1 < children.length ? <Gap gap={gap} /> : null}
          </Fragment>
        ))
      : children}
  </Flex>
);

export const HStack: React.FC<HVStackProps> = (props) => <Stack direction="horizontal" {...props} />;

export const VStack: React.FC<HVStackProps> = (props) => <Stack direction="vertical" {...props} />;
