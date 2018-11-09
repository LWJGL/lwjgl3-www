import { useState } from 'react';

/*
  TODO:
  ----
  [ ] Use useReducer internally?
  [ ] Use useImmer?
  [ ] Add option to group versions that were created within a certain time threshold.
  [ ] Add option to limit number of versions kept.
*/

export function useUndo<T>(initialState: T) {
  const [versions, setVersions] = useState<T[]>([initialState]);
  const [currentVersion, setCurrentVersion] = useState(0);

  const hasUndo = currentVersion !== 0;
  const hasRedo = currentVersion !== versions.length - 1;

  const createVersion = (version: T) => {
    const willBranch = currentVersion !== versions.length - 1;

    const nextVersions = willBranch ? versions.slice(0, currentVersion + 1) : versions;

    setVersions([...nextVersions, version]);
    setCurrentVersion(nextVersions.length);
  };

  const undo = () => setCurrentVersion(Math.max(currentVersion - 1, 0));

  const redo = () => setCurrentVersion(Math.min(currentVersion + 1, versions.length - 1));

  return [
    versions[currentVersion],
    createVersion,
    {
      undo,
      redo,
      hasUndo,
      hasRedo,
    },
  ];
}
