import { styled } from '~/theme/stitches.config';
import { theme } from '~/theme';
import { useProxy } from 'valtio';
import { cc } from '~/theme/cc';

const DarkDiv = styled('div', {
  color: '$text',
  backgroundColor: '$dark',
  '.dark &': {
    color: 'white',
    backgroundColor: '$darker',
  },
});

export const Dark: React.FC<React.ComponentProps<typeof DarkDiv>> = ({ children, className, ...rest }) => {
  const { dark } = useProxy(theme);

  return (
    <DarkDiv className={cc('dark', dark.toString(), className)} {...rest}>
      {children}
    </DarkDiv>
  );
};
