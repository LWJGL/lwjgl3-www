import { useCallback } from 'react';
import { useColorScheme } from '~/hooks/useColorScheme';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/moon';
import '~/theme/icons/fa/duotone/sun';

export const ThemeToggle: React.FC = () => {
  const [colorScheme, setScheme] = useColorScheme();

  const toggleScheme = useCallback(() => {
    // disable transitions/animations while switching theme
    document.body.classList.add('no-motion');
    setScheme(colorScheme === 'light' ? 'dark' : 'light');
    requestAnimationFrame(() => {
      document.body.classList.remove('no-motion');
    });
  }, [colorScheme, setScheme]);

  const schemeSwitchButtonTitle = `Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} theme`;

  return (
    <button onClick={toggleScheme} title={schemeSwitchButtonTitle} aria-label={schemeSwitchButtonTitle}>
      <svg focusable={false} preserveAspectRatio="xMidYMid meet" width="20" height="20">
        <use xlinkHref={`#${colorScheme === 'dark' ? 'fa/duotone/sun' : 'fa/duotone/moon'}`} />
      </svg>
    </button>
  );
};
