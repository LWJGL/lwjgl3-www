import { useCallback } from 'react';
import { NavLink } from '~/components/router/client';
import { useColorScheme } from '~/hooks/useColorScheme';
import { styled } from '~/theme/stitches.config';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/moon';
import '~/theme/icons/fa/duotone/sun';
import * as routes from '~/routes';

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
      color: '$caution9',
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
    '@md-down': {
      '&.active:focus,&:focus,&:hover': {
        color: 'yellow',
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
        // gap: '0 1.5rem',
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
            textDecoration: 'underline dotted',
            textDecorationColor: '$caution9',
            textUnderlineOffset: '0.1em',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
          '&:hover,&.active': {
            color: '$caution9',
          },
        },
      },
    },
  },
});

export const MainMenu: React.FC<Props> = ({ onClick, direction, focusableProps = {}, ...rest }) => {
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
    <MainMenuContainer role="navigation" aria-label="Main Menu" direction={direction} {...rest}>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/" end onPointerDown={routes.Home.preload}>
          HOME
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/guide" onPointerDown={routes.Guide.preload}>
          GET STARTED
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/download" onPointerDown={routes.Download.preload}>
          DOWNLOAD
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/customize" onPointerDown={routes.Customize.preload}>
          CUSTOMIZE
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/source" onPointerDown={routes.Source.preload}>
          SOURCE
        </NavLink>
      </div>
      <div>
        <NavLink {...focusableProps} onClick={onClick} to="/frameworks" onPointerDown={routes.Frameworks.preload}>
          FRAMEWORKS
        </NavLink>
      </div>
      <div className="dark">
        <Button
          size="sm"
          rounding="icon"
          tone="caution"
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
