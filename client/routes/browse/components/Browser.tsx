// @jsx jsx
import { jsx } from '@emotion/core';
import { Link } from '@reach/router';
import * as React from 'react';
import { Fragment, Suspense, useEffect, useRef, useState } from 'react';
import { createCache, createResource } from 'react-cache';
import { unstable_scheduleCallback } from 'scheduler';
import IconCloud from '~/components/icons/md/Cloud';
import { HTTP_OK } from '~/services/http_status_codes';
import { File } from './File';
import { Folder, FolderTH, SpinnerRow } from './Folder';

jsx;

// Contents Resource

const cache = createCache();
const BrowserContentsResource = createResource<string, FolderData>(fetchContents);

interface FolderData {
  path: string;
  files: Array<string>;
  folders: Array<string>;
}

type FolderDataAPI = Partial<FolderData>;

async function fetchContents(path: string): Promise<FolderData> {
  if (path === '') {
    return {
      path: '',
      files: [],
      folders: ['release', 'stable', 'nightly'],
    };
  }

  const response = await fetch(`/list?path=${path}/`);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }

  let contents: FolderDataAPI = await response.json();
  contents.path = path;
  if (contents.files === undefined) {
    contents.files = [];
  }
  contents.folders =
    contents.folders === undefined ? [] : contents.folders.map(name => name.substring(0, name.length - 1));

  return contents as FolderData;
}

// Browser
interface Props {
  path: string;
}

export function Browser({ path: loading }: Props) {
  const [path, setPath] = useState(loading);
  const mounted = useRef(false);

  useEffect(
    () => {
      mounted.current = true;
      if (loading !== path) {
        unstable_scheduleCallback(() => setPath(loading));
      }
    },
    [loading]
  );

  return (
    <div className="table-responsive-md mt-sm-4">
      <table className="table mb-0">
        <thead className="thead-light">
          <tr>
            <th colSpan={2}>
              <IconCloud /> &nbsp;
              <Link to={'/browse'}>lwjgl</Link>
              {path.length
                ? path.split('/').map((it, i, arr) => {
                    const subpath = arr.slice(0, i + 1).join('/');
                    return (
                      <Fragment key={subpath}>
                        /<Link to={`/browse/${subpath}`}>{it}</Link>
                      </Fragment>
                    );
                  })
                : null}
            </th>
          </tr>
        </thead>
        <tbody>
          {path !== '' && (
            <tr>
              <th css={FolderTH} scope="row" colSpan={2}>
                <Link to={path.substr(0, path.lastIndexOf('/')) || '/browse'}>&hellip;</Link>
              </th>
            </tr>
          )}
          <Suspense maxDuration={mounted.current ? 3200 : 0} fallback={<SpinnerRow />}>
            <Contents path={path} loading={loading} />
          </Suspense>
        </tbody>
      </table>
    </div>
  );
}

// Browser Contents
interface ContentProps {
  path: string;
  loading?: string;
}

function Contents({ path, loading }: ContentProps) {
  const { folders, files } = BrowserContentsResource.read(cache, path);
  const basePath = path.length ? path + '/' : '';
  return (
    <Fragment>
      {folders.map(folder => {
        const fullPath = `${basePath}${folder}`;
        return <Folder key={fullPath} path={fullPath} loading={loading === fullPath} />;
      })}
      {files.map(file => (
        <File key={`${basePath}${file}`} path={`${basePath}${file}`} />
      ))}
    </Fragment>
  );
}
