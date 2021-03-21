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
  a: {
    display: 'inline-block',
    color: 'white',
    fontWeight: '$light',
    textDecoration: 'none',
    transition: '0.5s background-size ease-out',
    b: {
      fontWeight: '$bold',
    },
    '&:focus': {
      outline: 'none',
    },
    '&.active': {
      color: 'yellow',
    },
    '@lg': {
      lineHeight: '2.25rem',
      background:
        'linear-gradient(to right, transparent, currentColor 20%, currentColor 80%, transparent) bottom / 0 3px no-repeat',
      '&.active': {
        backgroundSize: '100% 3px',
      },
      '&:not(.active):focus,&:not(.active):hover': {
        // backgroundImage: 'linear-gradient(to right, transparent, white 5%, white 95%, transparent)',
        backgroundSize: '90% 3px',
      },
    },
  },
  variants: {
    direction: {
      horizontal: {
        flex: '1 0 auto',
        display: 'inline-flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        // gridGap: '0 1.5rem',
        hgap: '$gutter',
      },
      vertical: {
        display: 'flex',
        flexFlow: 'column nowrap',
        textAlign: 'right',
        vgap: '0.25rem',
        a: {
          padding: '$xsm',
          marginRight: '-$xsm',
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
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/" end>
          HOME
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/guide">
          GET STARTED
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/download">
          DOWNLOAD
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/customize">
          CUSTOMIZE
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/source">
          SOURCE
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/frameworks">
          FRAMEWORKS
        </NavLink>
      </div>
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
