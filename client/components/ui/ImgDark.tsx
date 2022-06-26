import { useColorScheme } from '~/hooks/useColorScheme';
import { ImgLazy } from './ImgLazy';
import type { ImgLazyProps } from './ImgLazy';

interface Props extends ImgLazyProps {
  darkSrc: string;
}

export const ImgDark: React.FC<Props> = ({ darkSrc, src, loading, ...rest }) => {
  const [colorScheme] = useColorScheme();
  const activeSrc = colorScheme === 'dark' ? darkSrc : src;
  return loading === 'lazy' ? <ImgLazy src={activeSrc} {...rest} /> : <img src={activeSrc} {...rest} />;
};
