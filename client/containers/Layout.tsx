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

// Animation
import { Globals } from '@react-spring/web';
import { useReduceMotion } from 'react-reduce-motion';

export const Layout: React.FC<{ children?: never }> = () => {
  // Disable animations globally if reduce motion is enabled
  const prefersReducedMotion = useReduceMotion();
  useEffect(() => {
    Globals.assign({
      skipAnimation: prefersReducedMotion,
    });
  }, [prefersReducedMotion]);

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
