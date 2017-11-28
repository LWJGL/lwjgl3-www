// @flow
import * as React from 'react';
import { LoaderSpinner } from '~/components/LoaderSpinner';
import { Folder, FolderName } from './Folder';
import { File } from './File';
import IconCloud from 'react-icons/fa/cloud';
import IconArrowRight from 'react-icons/fa/chevron-right';

type Props = {|
  path: string,
  parent: string,
  folders: Array<string>,
  files: Array<string>,
  loading: boolean,
  loadPath: string => void,
|};

export class Browser extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.loadPath(this.props.path);
  }

  goBack = () => {
    this.props.loadPath(this.props.parent);
  };

  render() {
    const { parent, folders, files, loading, loadPath } = this.props;
    const path = this.props.path === '/' ? '' : this.props.path;

    return (
      <table className="table mb-0">
        <thead className="thead-default">
          <tr>
            <th colSpan={2}>
              <IconCloud /> &nbsp;lwjgl/{path}
            </th>
          </tr>
        </thead>
        <tbody>
          {parent && (
            <tr>
              <FolderName scope="row" onClick={this.goBack} colSpan={2}>
                &hellip;
              </FolderName>
            </tr>
          )}
          {folders.map(folder => <Folder key={`${path}${folder}`} path={`${path}${folder}`} loadPath={loadPath} />)}
          {files.map(file => <File key={`${path}${file}`} path={`${path}${file}`} loadPath={loadPath} />)}
          {loading && (
            <tr>
              <th scope="row" colSpan={2}>
                <LoaderSpinner />
              </th>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}
