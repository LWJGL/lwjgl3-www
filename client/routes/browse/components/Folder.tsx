import React from 'react';
import { memo } from 'react';
import { css } from '@emotion/core';
import { Link } from '@reach/router';
import IconFolder from '~/components/icons/md/Folder';

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
  loading: boolean;
}

export const Folder = memo(({ path, loading = false }: Props) => {
  const parts = path.split('/');
  const name = parts[parts.length - 1];

  return (
    <tr>
      <th css={FolderTH} colSpan={2}>
        <Link to={path}>
          <IconFolder /> {name}{' '}
          {loading && (
            <div className="spinner-grow spinner-grow-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </Link>
      </th>
    </tr>
  );
});

export function SpinnerRow() {
  return (
    <tr>
      <td>
        <div className="spinner-grow" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </td>
    </tr>
  );
}
