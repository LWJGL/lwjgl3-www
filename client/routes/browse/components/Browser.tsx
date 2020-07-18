import { Fragment, Suspense, useState, useEffect, unstable_useTransition } from 'react';
import { Link } from 'react-router-dom';
import { File } from './File';
import { Folder, FolderWrap, SpinnerRow, FolderError } from './Folder';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { PathResource } from '../PathResource';
import { Icon } from '~/components/Icon';
import '~/components/icons/fa/solid/cloud';

// Browser
interface Props {
  path: string;
}

export function Browser({ path: targetPath }: Props) {
  const [path, setPath] = useState(targetPath);
  const [startTransition] = unstable_useTransition({
    timeoutMs: 2250, // 0.75 spinner circle * 3
  });

  useEffect(() => {
    if (targetPath !== path) {
      startTransition(() => {
        setPath(targetPath);
      });
    }
  }, [startTransition, targetPath, path]);

  return (
    <div className="table-responsive-md mt-sm-4">
      <table className="table mb-0">
        <thead>
          <tr className="table-dark">
            <th>
              <Icon name="fa/solid/cloud" /> &nbsp;
              <Link className="text-decoration-none link-light" to={'/browse'}>
                lwjgl
              </Link>
              {path.length
                ? path.split('/').map((it, i, arr) => {
                    const subpath = arr.slice(0, i + 1).join('/');
                    return (
                      <Fragment key={subpath}>
                        /
                        <Link className="text-decoration-none link-light" to={`/browse/${subpath}`}>
                          {it}
                        </Link>
                      </Fragment>
                    );
                  })
                : null}
            </th>
          </tr>
        </thead>
        <tbody>
          {path !== '' && (
            <FolderWrap>
              <Link className="text-decoration-none" to={path.substr(0, path.lastIndexOf('/')) || '/browse'}>
                &hellip;
              </Link>
            </FolderWrap>
          )}
          <ErrorBoundary fallback={FolderError}>
            <Suspense fallback={<SpinnerRow />}>
              <FolderContents path={path} targetPath={targetPath} />
            </Suspense>
          </ErrorBoundary>
        </tbody>
      </table>
    </div>
  );
}

// Browser Contents
interface ContentProps {
  path: string;
  targetPath?: string;
}

function FolderContents({ path, targetPath }: ContentProps) {
  const { folders, files } = PathResource.read(path);
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
