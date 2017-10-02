// @flow
import * as React from 'react';
import { downloadInit } from '../reducer';
import { MODE_ZIP } from '../constants';
import type { BuildConfig } from '../types';
import Connect from '~/store/Connect';

import BuildToolbar from './BuildToolbar';
import IconDownload from 'react-icons/md/file-download';

const BuildDownload = () => (
  <Connect
    state={({ build }: { build: BuildConfig }) => ({
      mode: build.mode,
    })}
    actions={{
      downloadInit,
    }}
  >
    {({ mode }, { downloadInit }) =>
      mode === MODE_ZIP ? (
        <BuildToolbar>
          <button className="btn btn-success" onClick={downloadInit}>
            <IconDownload /> DOWNLOAD ZIP
          </button>
        </BuildToolbar>
      ) : null}
  </Connect>
);

export default BuildDownload;
