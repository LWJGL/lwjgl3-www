// @flow
// @jsx jsx
import * as React from 'react';
//$FlowFixMe
import { unstable_Suspense as Suspense, Fragment, Component } from 'react';
import { createCache, createResource } from 'react-cache';
import { unstable_scheduleCallback } from 'scheduler';
import { delay } from '~/services/delay';

import { jsx } from '@emotion/core';
import { Folder, FolderTH } from './Folder';
import { File } from './File';
import { Link } from '@reach/router';
import { CircularProgress } from '~/components/CircularProgress';
import { HTTP_OK } from '~/services/http_status_codes';
import IconCloud from '~/components/icons/md/Cloud';
import IconChevronRight from '~/components/icons/md/ChevronRight';

type Props = {
  path: string,
};

type FolderData = {|
  path: string,
  files: Array<string>,
  folders: Array<string>,
|};

let cache;
function invalidateCache() {
  cache = createCache(invalidateCache);
}
invalidateCache();

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

  await delay(3000);

  return Promise.resolve(contents);
}

type State = {
  loading: string,
  path: string,
};

export class Browser extends Component<Props, State> {
  state = {
    loading: '',
    path: '',
  };

  componentDidUpdate() {
    const { path } = this.props;

    if (this.state.loading !== path) {
      this.setState({
        loading: path,
      });
      unstable_scheduleCallback(() => this.setState({ path }));
    }
  }

  render() {
    const { path, loading } = this.state;

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
            {path !== loading && <Spinner />}
            <Suspense maxDuration={2000} fallback={<Spinner />}>
              <Contents path={path} />
            </Suspense>
          </tbody>
        </table>
      </div>
    );
  }
}

function Contents({ path }: Props) {
  const { folders, files } = BrowserContentsResource.read(cache, path);
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
