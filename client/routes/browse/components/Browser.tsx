import { Fragment, Suspense, useState, useEffect, useTransition, use } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from '~/components/router/client';
import { File } from './File';
import { Folder, SpinnerRow, FolderError } from './Folder';
import { Box } from '~/components/ui/Box';
import { Row } from './Row';
import { getFolderData } from '../loaders/path';
import { Minimatch } from 'minimatch';

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
  }, [targetPath, path]);

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

var matchAddons = new Minimatch('addons/**');

function FolderContents({ path, targetPath }: ContentProps) {
  let { folders, files } = use(getFolderData(path));
  const basePath = path.length ? path + '/' : '';

  if (path === 'release') {
    folders.sort((a, b) => a.localeCompare(b) * -1);
  } else if (matchAddons.match(path)) {
    files.sort((a, b) => {
      let semVerRE = /[-]([0-9]+)[.]([0-9]+)[.]([0-9]+)[-.]/;
      let aSemVer = a.match(semVerRE);
      let bSemVer = b.match(semVerRE);

      if (aSemVer === null && bSemVer !== null) {
        return -1;
      } else if (aSemVer !== null && bSemVer === null) {
        return 1;
      } else if (aSemVer !== null && bSemVer !== null) {
        let aSemVerNum = parseInt(aSemVer[1]) * 1_000_000 + parseInt(aSemVer[2]) * 1_000 + parseInt(aSemVer[3]);
        let bSemVerNum = parseInt(bSemVer[1]) * 1_000_000 + parseInt(bSemVer[2]) * 1_000 + parseInt(bSemVer[3]);

        // let compare = aSemVerNum - bSemVerNum;
        let compare = bSemVerNum - aSemVerNum;

        if (compare !== 0) {
          return compare;
        }
      }

      // Do not account for special characters when sorting, it produces a better result
      return a.replace(/[-]/g, '').localeCompare(b.replace(/[-]/g, ''));
    });
  }

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
