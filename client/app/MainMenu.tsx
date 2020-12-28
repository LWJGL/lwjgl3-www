import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { scheme } from '~/theme';
import { styled } from '~/theme/stitches.config';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/moon';
import '~/theme/icons/fa/duotone/sun';

interface Props {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  vertical?: boolean;
  horizontal?: boolean;
  'data-ismodal'?: boolean; // @react-aria/overlays::ModalAriaProps
  focusableProps: Partial<React.Attributes<HTMLElement>>;
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

export const MainMenu: React.FC<Props> = ({ onClick, vertical, horizontal, focusableProps, ...rest }) => {
  const [currentScheme, setScheme] = useRecoilState(scheme);

  const toggleScheme = useCallback(() => {
    setScheme(currentScheme === 'light' ? 'dark' : 'light');
  }, [currentScheme, setScheme]);

  const schemeSwitchButtonTitle = `Switch to ${currentScheme === 'dark' ? 'light' : 'dark'} theme`;

  return (
    <MainMenuContainer
      role="navigation"
      aria-label="Main Menu"
      vertical={vertical === true}
      horizontal={horizontal === true}
      {...rest}
    >
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
          <Icon display="block" name={currentScheme === 'dark' ? 'fa/duotone/sun' : 'fa/duotone/moon'} />
        </Button>
      </div>
    </MainMenuContainer>
  );
};
