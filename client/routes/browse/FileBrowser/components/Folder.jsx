// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { loadPath } from '../reducer';
import styled from 'react-emotion';
import IconFolder from 'react-icons/md/folder';

export const FolderName = styled.th`
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #5bc0de;
    color: white;
  }
`;

type OwnProps = {|
  path: string,
|};

type ConnectedProps = {|
  loadPath: string => void,
|};

type Props = {|
  ...OwnProps,
  ...ConnectedProps,
|};

class Folder extends React.Component<Props> {
  clickHandle = () => {
    this.props.loadPath(this.props.path);
  };

  render() {
    const parts = this.props.path.split('/');
    const name = parts[parts.length - 2];

    return (
      <tr>
        <FolderName colSpan={2} onClick={this.clickHandle}>
          <IconFolder /> {name}
        </FolderName>
      </tr>
    );
  }
}

export default connect((state: Object, ownProps: OwnProps) => ({}), {
  loadPath,
})(Folder);
