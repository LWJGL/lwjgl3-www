import { Suspense, StrictMode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { OverlayProvider } from '@react-aria/overlays';
// import { ClickToComponent } from 'click-to-react-component';
import '~/services/screenFit';

// Routing
import { BrowserRouter, Routes, Route, Outlet } from '~/components/router/client';
import { NavProgress } from '~/components/ui/NavProgress';
import { PageError } from '~/routes/PageError';
import { PageBlank } from '~/routes/PageBlank';
import * as Page from '~/routes';
import { PageNotFound } from '../routes/PageNotFound';

// Layout
import { Header } from './Header';
import { Footer } from './Footer';
// import { styled } from '~/theme/stitches.config';

// Pull common modules on main bundle
import '~/routes/PageView';

/*
const LayoutContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  '& > *': {
    flexShrink: 0,
  },
});
*/

export const App: React.FC<{ children?: never }> = () => (
  <StrictMode>
    {/* <ClickToComponent /> */}
    <OverlayProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Page.Home />} />
            <Route path="/guide" element={<Page.Guide />} />
            <Route path="/download" element={<Page.Download />} />
            <Route path="/customize" element={<Page.Customize />} />
            <Route path="/browse/*" element={<Page.Browse />} />
            <Route path="/source" element={<Page.Source />} />
            <Route path="/frameworks" element={<Page.Frameworks />} />
            <Route path="/sponsors" element={<Page.Sponsors />} />
            <Route path="/license" element={<Page.License />} />
            {/* <Route path="/dev" element={<Page.Dev/>} /> */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </OverlayProvider>
  </StrictMode>
);

const Layout: React.FC<{ children?: never }> = () => (
  <>
    <Header />
    {/* <LayoutContainer> */}
    <main>
      <ErrorBoundary FallbackComponent={PageError}>
        <Suspense fallback={<PageBlank />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </main>
    <Footer />
    {/* </LayoutContainer> */}
    <NavProgress />
  </>
);
