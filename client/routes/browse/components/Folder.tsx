import { styled } from '~/theme/stitches.config';
import { Link } from 'react-router-dom';
import { Icon } from '~/components/Icon';
import '~/components/icons/fa/solid/folder';

const FolderTH = styled('th', {
  userSelect: 'none',
  a: {
    display: 'block',
    padding: '0.75rem',
    color: '#333',
    fontWeight: 'normal',
    ':hover': {
      textDecoration: 'none',
      backgroundColor: '#5bc0de',
      color: 'white',
      svg: {
        color: 'white',
      },
    },
    ':active': {
      color: 'yellow',
    },
  },
});

interface Props {
  path: string;
  loading?: boolean;
}

export const FolderWrap: React.FC<{}> = ({ children }) => {
  return (
    <tr>
      <FolderTH style={{ padding: 0 }} scope="row">
        {children}
      </FolderTH>
    </tr>
  );
};

export const Folder: React.FC<Props> = ({ path, loading = false }) => {
  const parts = path.split('/');
  const name = parts[parts.length - 1];

  return (
    <FolderWrap>
      <Link className="text-decoration-none" to={path}>
        <Icon name="fa/solid/folder" /> {name}
        {loading && (
          <div className="d-inline-block">
            <div className="spinner-grow spinner-grow-sm ml-1" role="status">
              <span className="visually-hidden">Loading&hellip;</span>
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
        <span className="visually-hidden">Loading&hellip;</span>
      </div>
    </td>
  </tr>
);

export function FolderError({ error }: { error: Error }) {
  return (
    <tr>
      <th className="text-danger">{error.message}</th>
    </tr>
  );
}
