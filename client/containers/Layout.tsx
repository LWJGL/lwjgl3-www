import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Routing
import { BrowserRouter } from 'react-router-dom';
import { PageError } from '../components/routes/PageError';
import { PageBlank } from '../components/routes/PageBlank';
import { NavProgress } from '../components/NavProgress';
import { RouterConfig } from '../routes';

// Layout
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout: React.FC<{ children?: never }> = () => {
  return (
    <BrowserRouter>
      <NavProgress />
      <Header />
      <main>
        <ErrorBoundary fallback={PageError}>
          <Suspense fallback={<PageBlank />}>
            <RouterConfig />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </BrowserRouter>
  );
};
