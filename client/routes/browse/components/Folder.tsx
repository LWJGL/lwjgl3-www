import React from 'react';
import { css } from '@emotion/core';
import { Link } from '@reach/router';
import { Icon, Folder as FolderIcon } from '~/components/icons';

export const FolderTH = css`
  user-select: none;
  padding: 0 !important;
  a {
    display: block;
    padding: 0.75rem;
    color: #333;
    font-weight: normal;
    &:hover {
      text-decoration: none;
      background-color: #5bc0de;
      color: white;
      svg {
        color: white;
      }
    }
  }
`;

interface Props {
  path: string;
  loading?: boolean;
}

export const Folder: React.FC<Props> = ({ path, loading = false }) => {
  const parts = path.split('/');
  const name = parts[parts.length - 1];

  return (
    <tr>
      <th css={FolderTH} colSpan={2}>
        <Link to={path}>
          <Icon children={<FolderIcon />} /> {name}
          {loading && (
            <div className="spinner-grow spinner-grow-sm ml-1" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </Link>
      </th>
    </tr>
  );
};

export const SpinnerRow: React.FC = () => (
  <tr>
    <td>
      <div className="spinner-grow" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </td>
  </tr>
);
