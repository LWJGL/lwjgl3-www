import { useRecoilValue } from 'recoil';
import { scheme } from '~/theme';
import { ImgLazy } from './ImgLazy';
import type { ImgLazyProps } from './ImgLazy';

interface Props extends ImgLazyProps {
  darkSrc: string;
}

export const ImgDark: React.FC<Props> = ({ darkSrc, src, loading, ...rest }) => {
  const currentScheme = useRecoilValue(scheme);
  const activeSrc = currentScheme === 'dark' ? darkSrc : src;
  return loading === 'lazy' ? <ImgLazy src={activeSrc} {...rest} /> : <img src={activeSrc} {...rest} />;
};
