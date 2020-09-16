import { useMemo, useCallback } from 'react';
import { useMemoSlice } from './Store';
import { NATIVE_ALL } from './types';
import type { Binding, BindingDefinition, Native, NativeMap, BuildStore } from './types';
import { toggleArtifact } from './actions';

// UI
import { Checkbox } from '~/components/Checkbox';
import { cc } from '~/theme/cc';

const getSupportedPlatforms = (natives: NativeMap, platforms: Array<Native>, disabled: boolean) => (
  <p className={disabled ? 'text-danger' : 'text-secondary'}>
    <em>Supported platforms: </em>
    {platforms.map((platform) => natives[platform].title).join(', ')}
  </p>
);

const getSlice = ({ contents, availability, descriptions, artifacts, natives }: BuildStore) => ({
  contents,
  availability,
  descriptions,
  natives: natives.byId,
  allIds: artifacts.allIds,
  byId: artifacts.byId,
});

const getInputs = (state: BuildStore) => [state.contents, state.availability, state.descriptions];

export function BuildArtifacts() {
  const [slice, dispatch] = useMemoSlice(getSlice, getInputs);
  const onChange = useCallback((artifact: Binding) => dispatch(toggleArtifact(artifact)), [dispatch]);

  return useMemo(() => {
    const { contents, availability, descriptions, allIds, byId, natives } = slice;

    return (
      <div className="custom-controls-stacked">
        {allIds.map((it: Binding) => {
          const artifact = byId[it] as BindingDefinition;
          const available = availability[it] === true;

          return (
            <BuildArtifact
              key={it}
              natives={natives}
              artifact={artifact}
              disabled={!available || artifact.required === true}
              selected={available && contents[it] === true}
              showDescriptions={descriptions}
              onChange={onChange}
            />
          );
        })}
      </div>
    );
  }, [slice, onChange]);
}

interface Props {
  natives: NativeMap;
  artifact: BindingDefinition;
  disabled: boolean;
  selected: boolean;
  showDescriptions: boolean;
  onChange: any;
}

const BuildArtifact: React.FC<Props> = ({ natives, artifact, selected, disabled, showDescriptions, onChange }) => {
  if (showDescriptions) {
    return (
      <div className={cc('artifact', { 'text-muted': disabled })}>
        <Checkbox
          value={artifact.id}
          label={artifact.title}
          disabled={disabled}
          checked={selected}
          onChange={onChange}
        />
        {artifact.natives &&
          artifact.natives !== NATIVE_ALL &&
          artifact.nativesOptional !== true &&
          getSupportedPlatforms(natives, artifact.natives, disabled)}
        <p dangerouslySetInnerHTML={{ __html: artifact.description }} />
        {artifact.website !== undefined && (
          <p>
            <a href={artifact.website} target="_blank" rel="noopener">
              {artifact.website}
            </a>
          </p>
        )}
      </div>
    );
  } else {
    return (
      <Checkbox value={artifact.id} label={artifact.title} disabled={disabled} checked={selected} onChange={onChange} />
    );
  }
};
