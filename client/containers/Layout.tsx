import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PageError } from '../components/routes/PageError';
import { PageBlank } from '../components/routes/PageBlank';
// import { NavProgress } from '../components/NavProgress';
import { RouterConfig } from '../routes';

export const Layout: React.FC<{ children?: never }> = () => (
  <BrowserRouter timeout={2000}>
    {/* <NavProgress /> */}
    <Header />
    <main>
      <ErrorBoundary fallback={PageError}>
        <Suspense fallback={<PageBlank />} unstable_avoidThisFallback={true}>
          <RouterConfig />
        </Suspense>
      </ErrorBoundary>
    </main>
    <Footer />
  </BrowserRouter>
);
