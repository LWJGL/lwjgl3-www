import { Fragment, Suspense, useState, useTransition, experimental_use as use } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from '~/components/router/client';
import { File } from './File';
import { Folder, SpinnerRow, FolderError } from './Folder';
import { Box } from '~/components/ui/Box';
import { Row } from './Row';
import { getFolderData } from '../loaders/path';

// Browser
interface Props {
  path: string;
}

export function Browser({ path: targetPath }: Props) {
  const [path, setPath] = useState(targetPath);
  const [, startTransition] = useTransition();

  if (targetPath !== path) {
    startTransition(() => {
      setPath(targetPath);
    });
  }

  return (
    <Box css={{ '.light &': { boxShadow: '$sm' } }}>
      <Row type="breadcrump">
        <Link to={'/browse'}>lwjgl</Link>
        {path.length
          ? path.split('/').map((it, i, arr) => {
              const subpath = arr.slice(0, i + 1).join('/');
              return (
                <Fragment key={subpath}>
                  /<Link to={`/browse/${subpath}`}>{it}</Link>
                </Fragment>
              );
            })
          : null}
        /
      </Row>
      {path.length > 0 && (
        <Row type="folder">
          <Link to={path.lastIndexOf('/') !== -1 ? path.slice(0, path.lastIndexOf('/')) : ''}>&hellip;</Link>
        </Row>
      )}
      <ErrorBoundary FallbackComponent={FolderError}>
        <Suspense fallback={<SpinnerRow />}>
          <FolderContents path={path} targetPath={targetPath} />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
}

// Browser Contents
interface ContentProps {
  path: string;
  targetPath?: string;
}

function FolderContents({ path, targetPath }: ContentProps) {
  const { folders, files } = use(getFolderData(path));
  const basePath = path.length ? path + '/' : '';
  return (
    <>
      {folders.map((folder) => {
        const fullPath = `${basePath}${folder}`;
        return <Folder key={fullPath} path={fullPath} loading={targetPath === fullPath} />;
      })}
      {files.map((file) => (
        <File key={`${basePath}${file}`} path={`${basePath}${file}`} />
      ))}
    </>
  );
}
