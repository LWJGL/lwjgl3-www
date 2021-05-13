import { Fragment, Suspense, useState, useEffect, useTransition } from 'react';
import { Link } from '~/components/router/client';
import { File } from './File';
import { Folder, SpinnerRow, FolderError } from './Folder';
import { ErrorBoundary } from '~/components/system/ErrorBoundary';
import { Box } from '~/components/layout/Box';
import { Row } from './Row';
import { readPath } from '../loaders/path';

// Browser
interface Props {
  path: string;
}

export function Browser({ path: targetPath }: Props) {
  const [path, setPath] = useState(targetPath);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (targetPath !== path) {
      startTransition(() => {
        setPath(targetPath);
      });
    }
  }, [startTransition, targetPath, path]);

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
      {path !== '' && (
        <Row type="folder">
          <Link to={path.substr(0, path.lastIndexOf('/')) || '/browse'}>&hellip;</Link>
        </Row>
      )}
      <ErrorBoundary fallback={FolderError}>
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
  const { folders, files } = readPath(path);
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
