import { NavLink } from 'react-router-dom';
import { useProxy } from 'valtio';
import { styled } from '~/theme/stitches.config';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/moon';
import '~/theme/icons/fa/duotone/sun';

import { theme, toggleScheme } from '~/theme';

interface Props {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  vertical?: boolean;
  horizontal?: boolean;
  'data-ismodal'?: boolean; // @react-aria/overlays::ModalAriaProps
}

const MainMenuContainer = styled('nav', {
  variants: {
    horizontal: {
      true: {
        flex: '1 0 auto',
        display: 'inline-flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        // gap: '0 1.5rem',
        hgap: '1.5rem',
      },
    },
    vertical: {
      true: {
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
          ':focus': {
            outline: 'none',
            // textDecoration: 'underline',
          },
          ':active': {
            transform: 'translateY(1px)',
          },
          ':hover,&.active': {
            color: 'yellow',
          },
        },
      },
    },
  },
});

export const MainMenu: React.FC<Props> = ({ onClick, vertical, horizontal, ...rest }) => {
  const { scheme } = useProxy(theme);
  return (
    <MainMenuContainer
      role="navigation"
      aria-label="Main Menu"
      vertical={vertical === true}
      horizontal={horizontal === true}
      {...rest}
    >
      <NavLink onClick={onClick} to="/" end>
        HOME
      </NavLink>
      <NavLink onClick={onClick} to="/guide">
        GET STARTED
      </NavLink>
      <NavLink onClick={onClick} to="/download">
        DOWNLOAD
      </NavLink>
      <NavLink onClick={onClick} to="/customize">
        CUSTOMIZE
      </NavLink>
      <NavLink onClick={onClick} to="/source">
        SOURCE
      </NavLink>
      <NavLink onClick={onClick} to="/frameworks">
        FRAMEWORKS
      </NavLink>
      <div>
        <Button size="sm" rounding="icon" variant="text" onClick={toggleScheme}>
          <Icon display="block" name={scheme === 'dark' ? 'fa/duotone/sun' : 'fa/duotone/moon'} />{' '}
        </Button>
      </div>
    </MainMenuContainer>
  );
};
