// @flow
// @jsx jsx
import * as React from 'react';
//$FlowFixMe
import { unstable_Suspense as Suspense, Fragment } from 'react';
import { createCache, createResource } from 'react-cache';

import { jsx } from '@emotion/core';
import { Folder, FolderTH } from './Folder';
import { File } from './File';
import IconCloud from '~/components/icons/md/Cloud';
import IconChevronRight from '~/components/icons/md/ChevronRight';
import { Link } from '@reach/router';
import { CircularProgress } from '~/components/CircularProgress';
import { HTTP_OK } from '~/services/http_status_codes';

type Props = {
  path: string,
};

type FolderData = {|
  path: string,
  files: Array<string>,
  folders: Array<string>,
|};

const cache = createCache();
const BrowserContentsResource = createResource(fetchContents);

async function fetchContents(path: string): Promise<FolderData> {
  if (path === '') {
    return Promise.resolve({
      path: '',
      files: [],
      folders: ['release', 'stable', 'nightly'],
    });
  }

  const response = await fetch(`/list?path=${path}/`);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }

  let contents = await response.json();
  contents.path = path;
  if (contents.files === undefined) {
    contents.files = [];
  }
  contents.folders =
    contents.folders === undefined ? [] : contents.folders.map(name => name.substring(0, name.length - 1));

  return contents;
}

export function Browser({ path }: Props) {
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
          <Suspense maxDuration={500} fallback={<Spinner />}>
            <ContentList path={path} />
          </Suspense>
        </tbody>
      </table>
    </div>
  );
}

function ContentList({ path }: { path: string }) {
  return <Contents path={path} contents={BrowserContentsResource.read(cache, path)} />;
}

type ContentsProps = {
  path: string,
  contents: FolderData,
};

function Contents({ path, contents }: ContentsProps) {
  const { folders, files } = contents;
  const basePath = path.length ? path + '/' : '';

  return (
    <Fragment>
      {folders.map(folder => {
        const fullPath = `${basePath}${folder}`;
        return <Folder key={fullPath} path={fullPath} />;
      })}
      {files.map(file => (
        <File key={`${basePath}${file}`} path={`${basePath}${file}`} />
      ))}
    </Fragment>
  );
}

function Spinner() {
  return (
    <tr>
      <td>
        <CircularProgress size={24} thickness={8} />
      </td>
    </tr>
  );
}
