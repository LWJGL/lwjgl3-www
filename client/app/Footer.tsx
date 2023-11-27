import { Link, useLocation } from '~/components/router/client';
import { styled } from '~/theme/stitches.config';
import { SectionContainer } from '~/components/ui/Section';
import { Grid } from '~/components/layout/Grid';
import { Dark } from '~/components/lwjgl/Dark';
import { BackToTop } from '~/components/ui/BackToTop';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/external-link';
import * as routes from '~/routes';

const FooterLink = styled('a', {
  lineHeight: '2rem',
  '&:hover': {
    color: '$caution9',
  },
  '&:focus-visible': {
    color: '$caution9',
    outline: 'none',
  },
});

const FooterNav = styled(Link, FooterLink);

const Heading = styled('h2', {
  fontWeight: '$light',
  fontSize: '1.6rem',
  lineHeight: 1,
  mb: '$xsm',
  mt: -4,

  '@lg-down': {
    fontSize: '1.4rem',
    fontWeight: '$normal',
    mt: -2,
  },
});

const external = (
  <Icon
    name="fa/duotone/external-link"
    css={{
      fontSize: '$sm',
      color: '$caution6',
      ml: '$xxsm',
    }}
  />
);

const DarkFooter = styled('footer', Dark);

const Nav = styled('nav', Grid);

const LicenseArea = styled('div', {
  textAlign: 'center',
  pt: '$safe',
});

const FOOTER = (
  <DarkFooter
    className="dark"
    css={{
      // This is needed for the full page grid
      mt: 'auto',
    }}
  >
    <SectionContainer padding>
      <Nav
        css={{
          gap: '$safe',
          wrap: 'truncate',
          '@sm': {
            grid: 'auto-flow / 3fr 3fr',
          },
          '@md': {
            grid: 'auto-flow / 3fr 3fr 1fr',
            '> :nth-child(1)': { order: 1 },
            '> :nth-child(2)': { order: 2 },
            '> :nth-child(3)': { order: 4 },
            '> :nth-child(4)': { order: 5 },
            '> :nth-child(5)': { order: 3 },
          },
          '@lg': {
            grid: 'auto-flow / 3fr 3fr 3fr 3fr 1fr',
            '> :nth-child(3)': { order: 3 },
            '> :nth-child(4)': { order: 4 },
            '> :nth-child(5)': { order: 5 },
          },
        }}
      >
        <div>
          <Heading>About</Heading>
          <ul>
            <li>
              <FooterNav to="/" onPointerDown={routes.Home.preload}>
                Home
              </FooterNav>
            </li>
            <li>
              <FooterNav to="/guide" onPointerDown={routes.Guide.preload}>
                Get Started
              </FooterNav>
            </li>
            <li>
              <FooterNav to="/download" onPointerDown={routes.Download.preload}>
                Download
              </FooterNav>
            </li>
            <li>
              <FooterNav to="/customize" onPointerDown={routes.Customize.preload}>
                Customize
              </FooterNav>
            </li>
            <li>
              <FooterNav to="/source" onPointerDown={routes.Source.preload}>
                Source & Build Status
              </FooterNav>
            </li>
            <li>
              <FooterNav to="/frameworks" onPointerDown={routes.Frameworks.preload}>
                Frameworks
              </FooterNav>
            </li>
          </ul>
        </div>
        <div>
          <Heading>News</Heading>
          <ul>
            <li>
              <FooterLink href="https://blog.lwjgl.org/" rel="noopener external">
                Blog
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://twitter.com/lwjgl" rel="noopener external">
                Twitter {external}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://github.com/LWJGL/lwjgl3/commits/master" rel="noopener external">
                Changelog {external}
              </FooterLink>
            </li>
            <li>
              <FooterLink
                href="https://github.com/LWJGL/lwjgl3/blob/master/doc/notes/latest.md"
                rel="noopener external"
              >
                Release notes {external}
              </FooterLink>
            </li>
          </ul>
        </div>
        <div>
          <Heading>Developers</Heading>
          <ul>
            <li>
              <FooterLink href="https://github.com/LWJGL/lwjgl3" rel="noopener external">
                GitHub {external}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://github.com/LWJGL/lwjgl3-wiki/wiki" rel="noopener external">
                Wiki {external}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://github.com/LWJGL/lwjgl3/issues" rel="noopener external">
                Issues {external}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="http://javadoc.lwjgl.org/" rel="noopener external">
                JavaDoc
              </FooterLink>
            </li>
            <li>
              <FooterNav to="/license" onPointerDown={routes.License.preload}>
                License
              </FooterNav>
            </li>
          </ul>
        </div>
        <div>
          <Heading>Community</Heading>
          <ul>
            <li>
              <FooterLink href="https://discord.gg/6CywMCs" rel="noopener external">
                Discord {external}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="http://forum.lwjgl.org/" rel="noopener external">
                Forum
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://opencollective.com/lwjgl" target="_blank" rel="noopener external">
                Donate {external}
              </FooterLink>
            </li>
            <li>
              <FooterNav to="/contributors" onPointerDown={routes.Contributors.preload}>
                Contributors
              </FooterNav>
            </li>
          </ul>
        </div>
        <div>
          <BackToTop />
        </div>
      </Nav>
      <LicenseArea>
        <p>
          LW<b>JGL</b>
        </p>
        <p>
          Licensed under{' '}
          <FooterNav to="/license" css={{ display: 'inline', color: 'white' }} onPointerDown={routes.License.preload}>
            BSD
          </FooterNav>
        </p>
      </LicenseArea>
    </SectionContainer>
  </DarkFooter>
);

export const Footer: React.FC = () => {
  const location = useLocation();
  return location !== undefined && location.pathname !== '/customize' && !location.pathname.startsWith('/browse')
    ? FOOTER
    : null;
};
