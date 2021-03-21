import { Link, useLocation } from 'react-router-dom';
import { styled } from '~/theme/stitches.config';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { Box } from '~/components/layout/Box';
import { Dark } from '~/components/lwjgl/Dark';
import { BackToTop } from '~/components/ui/BackToTop';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/external-link';

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

const FOOTER = (
  <Dark
    as="footer"
    css={{
      // This is needed for the full page grid
      mt: 'auto',
    }}
  >
    <Container as="section" padding>
      <Grid
        as="nav"
        css={{
          gridGap: '$safe',
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
              <FooterLink as={Link} to="/">
                Home
              </FooterLink>
            </li>
            <li>
              <FooterLink as={Link} to="/guide">
                Get Started
              </FooterLink>
            </li>
            <li>
              <FooterLink as={Link} to="/download">
                Download
              </FooterLink>
            </li>
            <li>
              <FooterLink as={Link} to="/customize">
                Customize
              </FooterLink>
            </li>
            <li>
              <FooterLink as={Link} to="/source">
                Source & Build Status
              </FooterLink>
            </li>
            <li>
              <FooterLink as={Link} to="/frameworks">
                Frameworks
              </FooterLink>
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
              <FooterLink as={Link} to="/license">
                License
              </FooterLink>
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
              <FooterLink as={Link} to="/sponsors">
                Sponsors & Contributors
              </FooterLink>
            </li>
          </ul>
        </div>
        <div style={{ margin: '-0.25rem 0 0 -0.75rem' }}>
          <BackToTop />
        </div>
      </Grid>
      <Box
        as="section"
        css={{
          textAlign: 'center',
          color: '$primary500',
          pt: '$safe',
          '.dark &': {
            color: '$primary800',
          },
        }}
      >
        <p>
          LW<b>JGL</b> 3
        </p>
        <p>
          Licensed under{' '}
          <FooterLink as={Link} to="/license" css={{ display: 'inline', color: 'white' }}>
            BSD
          </FooterLink>
        </p>
      </Box>
    </Container>
  </Dark>
);

export const Footer: React.FC<{ children?: never }> = () => {
  const location = useLocation();
  return location !== undefined && location.pathname !== '/customize' && !location.pathname.startsWith('/browse')
    ? FOOTER
    : null;
};
