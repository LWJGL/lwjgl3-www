import { styled } from '~/theme/stitches.config';
import { cc } from '~/theme/cc';

interface DarkDivProps {
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const DarkDiv: React.FC<DarkDivProps> = ({ as = 'div', className, ...rest }) => {
  const Tag = as;
  return <Tag className={cc('dark', className)} {...rest} />;
};

export const Dark = styled(DarkDiv, {
  color: '$text',
  backgroundColor: '$dark',
  dark: {
    color: 'white',
    backgroundColor: '$darker',
  },
});
