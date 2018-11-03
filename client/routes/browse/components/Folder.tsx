// @jsx jsx
import * as React from 'react';
import { memo } from 'react';
import { jsx, css } from '@emotion/core';
jsx;
import { Link } from '@reach/router';
import IconFolder from '~/components/icons/md/Folder';
import { CircularProgress } from '~/components/CircularProgress';

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
            <span className="present-yourself">
              <CircularProgress className="ml-2" size={16} thickness={4} />
            </span>
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
        <CircularProgress size={24} thickness={8} />
      </td>
    </tr>
  );
}
