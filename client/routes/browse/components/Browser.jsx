// @flow
// @jsx jsx
import * as React from 'react';
//$FlowFixMe
import { lazy, unstable_Suspense as Suspense, Fragment, Component } from 'react';
import { createCache, createResource } from 'react-cache';
import { unstable_scheduleCallback } from 'scheduler';
import { delay } from '~/services/delay';

import { jsx } from '@emotion/core';
import { Folder, FolderTH, SpinnerRow } from './Folder';
import { File } from './File';
import { Link } from '@reach/router';

import { HTTP_OK } from '~/services/http_status_codes';
import IconCloud from '~/components/icons/md/Cloud';
import IconChevronRight from '~/components/icons/md/ChevronRight';

// Contents Resource

const cache = createCache();
const BrowserContentsResource = createResource(fetchContents);

type FolderData = {
  path: string,
  files: Array<string>,
  folders: Array<string>,
};

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

  let contents = await response.json();
  contents.path = path;
  if (contents.files === undefined) {
    contents.files = [];
  }
  contents.folders =
    contents.folders === undefined ? [] : contents.folders.map(name => name.substring(0, name.length - 1));

  return contents;
}

// Browser

type Props = {
  path: string,
};

type State = {
  path: string,
};

export class Browser extends Component<Props, State> {
  state = {
    path: this.props.path,
  };

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate() {
    const { path } = this.props;

    if (this.state.path !== path) {
      unstable_scheduleCallback(() => this.setState({ path }));
    }
  }

  render() {
    const { path: loading } = this.props;
    const { path } = this.state;

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
            {path !== loading ? (
              <Contents path={path} loading={loading} />
            ) : (
              <Suspense maxDuration={this.mounted ? 3200 : 0} fallback={<SpinnerRow />}>
                <Contents path={path} />
              </Suspense>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

// Browser Contents
type ContentProps = {
  path: string,
  loading?: string,
};

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
