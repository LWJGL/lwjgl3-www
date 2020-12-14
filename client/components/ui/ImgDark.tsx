import { useProxy } from 'valtio';
import { theme } from '~/theme';
import { ImgLazy } from './ImgLazy';
import type { ImgLazyProps } from './ImgLazy';

interface Props extends ImgLazyProps {
  dark: string;
}

export const ImgDark: React.FC<Props> = ({ dark, src, loading, ...rest }) => {
  const { scheme } = useProxy(theme);
  const activeSrc = scheme === 'dark' ? dark : src;
  return loading === 'lazy' ? <ImgLazy src={activeSrc} {...rest} /> : <img src={activeSrc} {...rest} />;
};
