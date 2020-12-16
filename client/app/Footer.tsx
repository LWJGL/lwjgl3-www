import { Link, useLocation } from 'react-router-dom';
import { styled } from '~/theme/stitches.config';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { Box } from '~/components/layout/Box';
import { Dark } from '~/components/lwjgl/Dark';
import { BackToTop } from '~/components/ui/BackToTop';

const FooterLink = styled('a', {
  textDecoration: 'underline',
  lineHeight: '2rem',
  ':hover': {
    color: 'yellow',
  },
  ':focus-visible': {
    color: 'yellow',
    outline: 'none',
  },
});

const Heading = styled('h2', {
  color: '$primary700',
  dark: {
    color: '$primary800',
  },
  fontWeight: '$light',
  fontSize: '2rem',
  lineHeight: 1,
  mb: '$xsm',
  mt: -4,
  'md-down': {
    fontSize: '1.5rem',
    mt: -2,
  },
});

const FOOTER = (
  <Dark as="footer" css={{ mt: 'auto' }}>
    <Container as="section" padding>
      <Grid
        as="nav"
        css={{
          gap: '$safe',
          md: {
            grid: 'auto-flow / 3fr 3fr 3fr 1fr',
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
            <li>
              <FooterLink as={Link} to="/sponsors">
                Sponsors & Contributors
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
              <FooterLink href="http://forum.lwjgl.org/" rel="noopener external">
                Forum
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://twitter.com/lwjgl" rel="noopener external">
                Twitter
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://github.com/LWJGL/lwjgl3/commits/master" rel="noopener external">
                Changelog
              </FooterLink>
            </li>
            <li>
              <FooterLink
                href="https://github.com/LWJGL/lwjgl3/blob/master/doc/notes/latest.md"
                rel="noopener external"
              >
                Release notes
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://opencollective.com/lwjgl" target="_blank" rel="external">
                Donate
              </FooterLink>
            </li>
          </ul>
        </div>
        <div>
          <Heading>Developers</Heading>
          <ul>
            <li>
              <FooterLink href="https://github.com/LWJGL/lwjgl3" rel="noopener external">
                GitHub
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://github.com/LWJGL/lwjgl3-wiki/wiki" rel="noopener external">
                Wiki
              </FooterLink>
            </li>
            <li>
              <FooterLink href="https://github.com/LWJGL/lwjgl3/issues" rel="noopener external">
                Issues
              </FooterLink>
            </li>
            <li>
              <FooterLink href="http://javadoc.lwjgl.org/" rel="noopener external">
                JavaDoc
              </FooterLink>
            </li>
            <li>
              <FooterLink href="http://slack.lwjgl.org/" rel="noopener external">
                Slack
              </FooterLink>
            </li>
            <li>
              <FooterLink as={Link} to="/license">
                License
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
          dark: { color: '$primary800' },
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
