import { Suspense } from 'react';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { OverlayProvider } from '@react-aria/overlays';
import { Spring } from './SpringGlobals';
import '~/services/screenFit';

// Routing
import { BrowserRouter } from 'react-router-dom';
// import { NavProgress } from '~/components/ui/NavProgress';
import { PageError } from '~/routes/PageError';
import { PageBlank } from '~/routes/PageBlank';
import { RouterConfig } from '~/routes';

// Layout
import { Header } from './Header';
import { Footer } from './Footer';
import { styled } from '~/theme/stitches.config';

// Pull common modules on main bundle
import '~/routes/PageView';

const Layout = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  '& > *': {
    flexShrink: 0,
  },
});

const Main = styled('main', {
  pt: '3rem',
});

export const App: React.FC<{ children?: never }> = () => (
  <BrowserRouter>
    <OverlayProvider>
      <Header />
      <Layout>
        <Main>
          <ErrorBoundary fallback={PageError}>
            <Suspense fallback={<PageBlank />}>
              <RouterConfig />
            </Suspense>
          </ErrorBoundary>
        </Main>
        <Footer />
      </Layout>
    </OverlayProvider>
    <Spring />
    {/* <NavProgress /> */}
  </BrowserRouter>
);
