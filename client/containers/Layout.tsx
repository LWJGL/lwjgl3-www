import { Suspense } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PageError } from '../components/routes/PageError';
import { PageBlank } from '../components/routes/PageBlank';

// Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  // Routes
  Home,
  Guide,
  Download,
  Customize,
  Browse,
  Source,
  License,
  Sponsors,
} from '../routes';
import { NotFound } from '../routes/error/NotFound';

export const Layout: React.FC<{ children?: never }> = () => (
  <BrowserRouter>
    <Header />
    <main>
      <ErrorBoundary fallback={PageError}>
        <Suspense fallback={<PageBlank />} unstable_avoidThisFallback={true}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/download" element={<Download />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/browse/*" element={<Browse />} />
            <Route path="/source" element={<Source />} />
            <Route path="/license" element={<License />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </main>
    <Footer />
  </BrowserRouter>
);
