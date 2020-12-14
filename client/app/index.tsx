import { Suspense } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { OverlayProvider } from '@react-aria/overlays';
import { Spring } from './SpringGlobals';
import '../services/screenFit';

// Routing
import { BrowserRouter } from 'react-router-dom';
// import { NavProgress } from '../components/ui/NavProgress';
import { PageError } from '../routes/PageError';
import { PageBlank } from '../routes/PageBlank';
import { RouterConfig } from '../routes';

// Layout
import { Header } from './Header';
import { Footer } from './Footer';
import { Grid } from '../components/layout/Grid';
import { Box } from '../components/layout/Box';

// Pull common modules on main bundle
import '../routes/PageView';
import '../components/ui/HashLinkTarget';

export const App: React.FC<{ children?: never }> = () => (
  <>
    <Spring />
    <BrowserRouter>
      <OverlayProvider>
        {/* <NavProgress /> */}
        <Header />
        <Grid
          css={{
            vh100: true,
            grid: 'auto min-content / auto',
          }}
        >
          <Box
            as="main"
            css={{
              pt: '3rem',
            }}
          >
            <ErrorBoundary fallback={PageError}>
              <Suspense fallback={<PageBlank />}>
                <RouterConfig />
              </Suspense>
            </ErrorBoundary>
          </Box>
          <Footer />
        </Grid>
      </OverlayProvider>
    </BrowserRouter>
  </>
);
