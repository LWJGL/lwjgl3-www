import { useMemo, useCallback } from 'react';
import { useMemoSlice } from './Store';
import { NATIVE_ALL } from './types';
import type { Binding, BindingDefinition, Native, NativeMap, BuildStore } from './types';
import { toggleArtifact } from './actions';
import { Text } from '~/components/ui/Text';

// UI
import { Checkbox } from '~/components/forms/Selection';
import { Anchor } from '~/components/lwjgl/Anchor';

const getSupportedPlatforms = (natives: NativeMap, platforms: Array<Native>, disabled: boolean) => (
  <Text css={{ color: disabled ? '$critical600' : '$positive500' }}>
    <em>Supported platforms: </em>
    {platforms.map((platform) => natives[platform].title).join(', ')}
  </Text>
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
  const onChange = useCallback((e, artifact: Binding) => dispatch(toggleArtifact(artifact)), [dispatch]);

  return useMemo(() => {
    const { contents, availability, descriptions, allIds, byId, natives } = slice;

    return (
      <>
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
      </>
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
    const desc = (
      <>
        {artifact.natives &&
          artifact.natives !== NATIVE_ALL &&
          artifact.nativesOptional !== true &&
          getSupportedPlatforms(natives, artifact.natives, disabled)}
        <p dangerouslySetInnerHTML={{ __html: artifact.description }} />
        {artifact.website !== undefined && (
          <p>
            <Anchor href={artifact.website} target="_blank" css={{ wrap: 'all' }}>
              {artifact.website}
            </Anchor>
          </p>
        )}
      </>
    );

    return (
      <Checkbox description={desc} value={artifact.id} disabled={disabled} checked={selected} onChange={onChange}>
        {artifact.title}
      </Checkbox>
    );
  } else {
    return (
      <Checkbox value={artifact.id} disabled={disabled} checked={selected} onChange={onChange}>
        {artifact.title}
      </Checkbox>
    );
  }
};
