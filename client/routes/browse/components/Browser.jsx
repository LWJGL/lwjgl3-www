// @flow
import * as React from 'react';
import { LoaderSpinner } from '~/components/LoaderSpinner';
import { Folder, FolderTH } from './Folder';
import { File } from './File';
import { FaCloud } from '~/components/icons/fa/cloud';
import { FaChevronRight } from '~/components/icons/fa/chevron-right';

import { HTTP_OK } from '~/services/http_status_codes';

type FolderData = {|
  path: string,
  files: Array<string>,
  folders: Array<string>,
|};

type Props = {||};

type State = {
  path: string | null,
  contents: FolderData | null,
};

type ContentCache = {
  [path: string]: FolderData,
};

async function fetchContents(path: string): Promise<FolderData> {
  const response = await fetch(`/list?path=${path}`);
  if (response.status !== HTTP_OK) {
    throw response.statusText;
  }
  const data = await response.json();
  data.path = path;
  if (!data.folders) {
    data.folders = [];
  }

  contentCache[path] = data;
  return data;
}

type ContentsProps = {
  path: string,
  changePath: string => void,
  contents: FolderData | null,
};

function Contents({ path, changePath, contents }: ContentsProps) {
  if (contents === null) {
    return (
      <tr>
        <td>
          <LoaderSpinner />
        </td>
      </tr>
    );
  }

  const { folders, files } = contents;

  return (
    <React.Fragment>
      {folders.map(folder => {
        const fullPath = `${path}${folder}`;
        return <Folder key={fullPath} path={fullPath} loadPath={() => changePath(fullPath)} />;
      })}
      {files.map(file => <File key={`${path}${file}`} path={`${path}${file}`} />)}
    </React.Fragment>
  );
}

let prevPath = '';

const contentCache: ContentCache = {
  '': {
    path: '',
    files: [],
    folders: ['release/', 'stable/', 'nightly/'],
  },
};

export class Browser extends React.Component<Props, State> {
  state = {
    path: null,
    contents: null,
  };

  mounted: boolean = false;

  async loadData() {
    const path = this.state.path;
    if (path === null) {
      return;
    }
    const contents = await fetchContents(path);
    // Make sure we haven't unmounted or changed path while waiting for the resposne
    if (this.mounted && path === this.state.path) {
      this.setState({ contents });
    }
  }

  changePath = (path: string) => {
    if (contentCache[path] !== undefined) {
      this.setState({ path, contents: contentCache[path] });
    } else {
      this.setState({ path, contents: null }, this.loadData);
    }
  };

  componentDidUpdate() {
    if (this.state.path !== null) {
      prevPath = this.state.path;
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.setState({ path: prevPath, contents: contentCache[prevPath] });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { path, contents } = this.state;

    if (path === null) {
      return null;
    }

    let parent = null;
    if (path !== '') {
      const parts = path.substr(0, path.length - 2).split('/');
      parts.pop();
      parent = parts.join('/');

      if (parent.length) {
        parent += '/';
      }
    }
    return (
      <div className="table-responsive-md">
        <table className="table mb-0">
          <thead className="thead-light">
            <tr>
              <th colSpan={2}>
                <FaCloud /> &nbsp;lwjgl/{this.state.path}
              </th>
            </tr>
          </thead>
          <tbody>
            {parent !== null && (
              <tr>
                <th className={FolderTH} scope="row" onClick={() => this.changePath(parent || '')} colSpan={2}>
                  &hellip;
                </th>
              </tr>
            )}
            <Contents path={path} contents={contents} changePath={this.changePath} />
          </tbody>
        </table>
      </div>
    );
  }
}
