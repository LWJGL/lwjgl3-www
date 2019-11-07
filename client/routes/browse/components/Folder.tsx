import React from 'react';
import { css } from 'emotion';
import { Link } from '@reach/router';
import { Icon, Folder as FolderIcon } from '~/components/icons';

export const FolderTH = css`
  padding: 0 !important;
  user-select: none;
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
    &:focus {
      color: #0071eb;
    }
    &:hover:focus {
      color: yellow;
    }
  }
`;

interface Props {
  path: string;
  loading?: boolean;
}

export const FolderWrap: React.FC<{}> = ({ children }) => {
  return (
    <tr>
      <th className={FolderTH} scope="row" colSpan={2}>
        {children}
      </th>
    </tr>
  );
};

export const Folder: React.FC<Props> = ({ path, loading = false }) => {
  const parts = path.split('/');
  const name = parts[parts.length - 1];

  return (
    <FolderWrap>
      <Link to={path}>
        <Icon children={<FolderIcon />} /> {name}
        {loading && (
          <div className="d-inline-block">
            <div className="spinner-grow spinner-grow-sm ml-1" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </Link>
    </FolderWrap>
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

export function FolderError({ error }: { error: Error }) {
  return (
    <tr>
      <th className="text-danger" colSpan={2}>
        {error.message}
      </th>
    </tr>
  );
}
