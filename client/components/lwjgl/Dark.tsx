import { styled } from '~/theme/stitches.config';
import { theme } from '~/theme';
import { useProxy } from 'valtio';
import { cc } from '~/theme/cc';

interface DarkDivProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const DarkDiv: React.FC<DarkDivProps> = ({ children, as = 'div', className, ...rest }) => {
  const { dark } = useProxy(theme);
  const Tag = as;

  return (
    <Tag className={cc('dark', dark.toString(), className)} {...rest}>
      {children}
    </Tag>
  );
};

export const Dark = styled(DarkDiv, {
  color: '$text',
  backgroundColor: '$dark',
  '.dark &': {
    color: 'white',
    backgroundColor: '$darker',
  },
});
