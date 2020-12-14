import { Link } from 'react-router-dom';
import { Icon } from '~/components/ui/Icon';
import { LoadingPulse } from '~/components/ui/LoadingPulse';
import '~/theme/icons/fa/solid/folder';
import { Row } from './Row';

interface Props {
  path: string;
  loading?: boolean;
}

export const Folder: React.FC<Props> = ({ path, loading = false }) => {
  const parts = path.split('/');
  const name = parts[parts.length - 1];

  return (
    <Row type="folder">
      <Link to={path}>
        <Icon name="fa/solid/folder" /> {name}
        {loading ? <LoadingPulse size="sm" css={{ ml: '$xxsm' }} /> : null}
      </Link>
    </Row>
  );
};

export const SpinnerRow: React.FC = () => <Row css={{ padding: '$sm', color: '$neutral500' }}>Loading&hellip;</Row>;

export const FolderError: React.FC<{ error: Error }> = ({ error }) => (
  <Row css={{ padding: '$sm', backgroundColor: '$critical800', color: '$caution300' }}>{error.message}</Row>
);
