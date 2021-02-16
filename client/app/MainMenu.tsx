import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useColorScheme, useColorSchemeToggle } from '~/app/context/ColorScheme';
import { styled } from '~/theme/stitches.config';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/moon';
import '~/theme/icons/fa/duotone/sun';

interface Props {
  direction: 'vertical' | 'horizontal';
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  'data-ismodal'?: boolean; // @react-aria/overlays::ModalAriaProps
  focusableProps?: Partial<React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>>;
}

const MainMenuContainer = styled('nav', {
  variants: {
    direction: {
      horizontal: {
        flex: '1 0 auto',
        display: 'inline-flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        // gap: '0 1.5rem',
        hgap: '$gutter',
      },
      vertical: {
        display: 'flex',
        flexFlow: 'column nowrap',
        textAlign: 'right',
        // gap: '1rem 0',
        vgap: '1rem',
        a: {
          fontSize: '$xl',
          color: 'white',
          textDecoration: 'none',
          fontWeight: 300,
          '&:focus': {
            outline: 'none',
            // textDecoration: 'underline',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
          '&:hover,&.active': {
            color: 'yellow',
          },
        },
      },
    },
  },
});

export const MainMenu: React.FC<Props> = ({ onClick, direction, focusableProps = {}, ...rest }) => {
  const colorScheme = useColorScheme();
  const setScheme = useColorSchemeToggle();

  const toggleScheme = useCallback(() => {
    setScheme(colorScheme === 'light' ? 'dark' : 'light');
  }, [colorScheme, setScheme]);

  const schemeSwitchButtonTitle = `Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} theme`;

  return (
    <MainMenuContainer role="navigation" aria-label="Main Menu" direction={direction} {...rest}>
      <NavLink {...focusableProps} onClick={onClick} to="/" end>
        HOME
      </NavLink>
      <NavLink {...focusableProps} onClick={onClick} to="/guide">
        GET STARTED
      </NavLink>
      <NavLink {...focusableProps} onClick={onClick} to="/download">
        DOWNLOAD
      </NavLink>
      <NavLink {...focusableProps} onClick={onClick} to="/customize">
        CUSTOMIZE
      </NavLink>
      <NavLink {...focusableProps} onClick={onClick} to="/source">
        SOURCE
      </NavLink>
      <NavLink {...focusableProps} onClick={onClick} to="/frameworks">
        FRAMEWORKS
      </NavLink>
      <div>
        <Button
          size="sm"
          rounding="icon"
          variant="text"
          onClick={toggleScheme}
          title={schemeSwitchButtonTitle}
          aria-label={schemeSwitchButtonTitle}
          {...focusableProps}
        >
          <Icon display="block" name={colorScheme === 'dark' ? 'fa/duotone/sun' : 'fa/duotone/moon'} />
        </Button>
      </div>
    </MainMenuContainer>
  );
};
