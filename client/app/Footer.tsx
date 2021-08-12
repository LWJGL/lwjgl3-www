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
    color: 'yellow',
  },
  '&:focus-visible': {
    color: 'yellow',
    outline: 'none',
  },
});

const FooterNav = styled(Link, FooterLink);

const Heading = styled('h2', {
  color: '$primary700',
  '.dark &': {
    color: '$primary800',
  },
  fontWeight: '$light',
  fontSize: '2rem',
  lineHeight: 1,
  mb: '$xsm',
  mt: -4,

  '@lg-down': {
    fontSize: '1.5rem',
    mt: -2,
  },
});

const external = (
  <Icon
    name="fa/duotone/external-link"
    css={{
      fontSize: '$sm',
      color: '$neutral500',
      ml: '$xxsm',
    }}
  />
);

const DarkFooter = styled('footer', Dark);
const Nav = styled('nav', Grid);
const LicenseArea = styled('div', {
  textAlign: 'center',
  color: '$primary500',
  pt: '$safe',
  '.dark &': {
    color: '$primary800',
  },
});

const FOOTER = (
  <DarkFooter
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
          '@md': {
            grid: 'auto-flow / 3fr 3fr 3fr 3fr 1fr',
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
              <FooterLink href="http://slack.lwjgl.org/" rel="noopener external">
                Slack {external}
              </FooterLink>
            </li>
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
              <FooterNav to="/sponsors" onPointerDown={routes.Sponsors.preload}>
                Sponsors & Contributors
              </FooterNav>
            </li>
          </ul>
        </div>
        <div style={{ margin: '-0.25rem 0 0 -0.75rem' }}>
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

export const Footer: React.FC<{ children?: never }> = () => {
  const location = useLocation();
  return location !== undefined && location.pathname !== '/customize' && !location.pathname.startsWith('/browse')
    ? FOOTER
    : null;
};
