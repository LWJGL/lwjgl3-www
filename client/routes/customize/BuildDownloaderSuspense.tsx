import React, { lazy, Suspense } from 'react';
import { ScreenLock } from '~/components/ScreenLock';

interface Props {
  setIsDownloading: (state: boolean) => void;
}

const BuildDownloader = lazy(() => import(/* webpackChunkName: "route-customize$downloader" */ './BuildDownloader'));

export function BuildDownloaderSuspense({ setIsDownloading }: Props) {
  return (
    <ScreenLock backdropClassName="dark">
      <Suspense fallback={null}>
        <BuildDownloader setIsDownloading={setIsDownloading} />
      </Suspense>
    </ScreenLock>
  );
}
