// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { loadPath } from '../reducer';
import LoaderSpinner from '~/components/LoaderSpinner';
import Folder, { FolderName } from './Folder';
import File from './File';
import IconCloud from 'react-icons/fa/cloud';
import IconArrowRight from 'react-icons/fa/chevron-right';

type OwnProps = {
  path: string,
  parent: string,
  folders: Array<string>,
  files: Array<string>,
  loading: boolean,
};

type ConnectedProps = {
  loadPath: string => void,
};

type Props = OwnProps & ConnectedProps;

class Browser extends React.Component<Props> {
  componentDidMount() {
    this.props.loadPath(this.props.path);
  }

  goBack = () => {
    this.props.loadPath(this.props.parent);
  };

  render() {
    const props = this.props;
    const path = props.path === '/' ? '' : props.path;

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
          {props.parent &&
            <tr>
              <FolderName scope="row" onClick={this.goBack} colSpan={2}>
                …
              </FolderName>
            </tr>}
          {props.folders.map(folder => <Folder key={`${path}${folder}`} path={`${path}${folder}`} />)}
          {props.files.map(file => <File key={`${path}${file}`} path={`${path}${file}`} />)}
          {props.loading &&
            <tr>
              <th scope="row" colSpan={2}>
                <LoaderSpinner />
              </th>
            </tr>}
        </tbody>
      </table>
    );
  }
}

export default connect(
  state => {
    return {
      ...state.browser.contents[state.browser.path],
      path: state.browser.path,
    };
  },
  {
    loadPath,
  }
)(Browser);
