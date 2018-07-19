// @flow
// @jsx jsx
import * as React from 'react';
import { jsx } from '@emotion/core';
import { Folder, FolderTH } from './Folder';
import { File } from './File';
import IconCloud from '~/components/icons/md/Cloud';
import IconChevronRight from '~/components/icons/md/ChevronRight';
import { Link } from '@reach/router';
import { CircularProgress } from '~/components/CircularProgress';

import { HTTP_OK } from '~/services/http_status_codes';

type FolderData = {|
  path: string,
  files: Array<string>,
  folders: Array<string>,
|};

type ContentCache = {
  [path: string]: FolderData,
};

async function fetchContents(path: string): Promise<FolderData> {
  const response = await fetch(`/list?path=${path}`);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }
  return await response.json();
}

type ContentsProps = {
  path: string,
  contents: FolderData | null,
};

function Contents({ path, contents }: ContentsProps) {
  if (contents === null) {
    return (
      <tr>
        <td>
          <CircularProgress size={24} thickness={8} />
        </td>
      </tr>
    );
  }

  const { folders, files } = contents;
  const basePath = path.length ? path + '/' : '';

  return (
    <React.Fragment>
      {folders.map(folder => {
        const fullPath = `${basePath}${folder}`;
        return <Folder key={fullPath} path={fullPath} />;
      })}
      {files.map(file => <File key={`${basePath}${file}`} path={`${basePath}${file}`} />)}
    </React.Fragment>
  );
}

const contentCache: ContentCache = {
  '': {
    path: '',
    files: [],
    folders: ['release', 'stable', 'nightly'],
  },
};

type Props = {
  path: string,
};

type State = {
  contents: FolderData | null,
};

export class Browser extends React.Component<Props, State> {
  state = {
    contents: contentCache[this.props.path] || null,
  };

  mounted: boolean = false;

  async loadData(path: string) {
    const contents = await fetchContents(path + '/');
    contents.path = path;
    if (contents.files === undefined) {
      contents.files = [];
    }
    contents.folders =
      contents.folders === undefined ? [] : contents.folders.map(name => name.substring(0, name.length - 1));

    // Store in cache
    contentCache[path] = contents;

    // Make sure we haven't unmounted or changed path while waiting for the resposne
    if (this.mounted && path === this.props.path) {
      this.setState({ contents });
    }
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    return {
      contents: contentCache[nextProps.path] || null,
    };
  }

  loadDataIfNeeded() {
    if (this.state.contents === null) {
      this.loadData(this.props.path);
    }
  }

  componentDidUpdate() {
    this.loadDataIfNeeded();
  }

  componentDidMount() {
    this.mounted = true;
    this.loadDataIfNeeded();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { path } = this.props;
    const hasParent = path !== '';

    return (
      <div className="table-responsive-md">
        <table className="table mb-0">
          <thead className="thead-light">
            <tr>
              <th colSpan={2}>
                <IconCloud /> &nbsp;lwjgl/{path.length ? path + '/' : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {hasParent && (
              <tr>
                <th css={FolderTH} scope="row" colSpan={2}>
                  <Link to={path.substr(0, path.lastIndexOf('/')) || '/browse'}>&hellip;</Link>
                </th>
              </tr>
            )}
            <Contents path={path} contents={this.state.contents} />
          </tbody>
        </table>
      </div>
    );
  }
}
