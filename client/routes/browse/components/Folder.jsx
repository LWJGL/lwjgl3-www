// @flow
// @jsx jsx
import * as React from 'react';
import { jsx } from '@emotion/core';
import css from '@emotion/css';
import { Link } from '@reach/router';

import IconFolder from '~/components/icons/md/Folder';

export const FolderTH = css`
  user-select: none;
  padding: 0 !important;
  a {
    display: block;
    padding: 0.75rem;
    color: #333;
    &:hover {
      text-decoration: none;
      background-color: #5bc0de;
      color: white;
    }
  }
`;

type Props = {|
  path: string,
|};

export class Folder extends React.PureComponent<Props> {
  render() {
    const parts = this.props.path.split('/');
    const name = parts[parts.length - 1];

    return (
      <tr>
        <th css={FolderTH} colSpan={2}>
          <Link to={this.props.path}>
            <IconFolder /> {name}
          </Link>
        </th>
      </tr>
    );
  }
}
