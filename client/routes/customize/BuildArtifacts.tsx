import { useCallback } from 'react';
import { Box } from '~/components/layout/Box';
import { Checkbox } from '~/components/forms/Selection';
import { Anchor } from '~/components/lwjgl/Anchor';
import { Text } from '~/components/ui/Text';
import { useSelector, useDispatch } from './Store';
import { NATIVE_ALL } from './types';
import {
  createActionArtifactToggle,
  selectorContents,
  selectorAvailability,
  selectorDescriptions,
  selectorNatives,
  selectorArtifacts,
} from './reducer';

import type { Binding, BindingDefinition, Native, NativeMap } from './types';

const getSupportedPlatforms = (natives: NativeMap, platforms: Array<Native>, disabled: boolean) => (
  <Text css={{ color: disabled ? '$critical600' : '$positive500' }}>
    <em>Supported platforms: </em>
    {platforms.map((platform) => natives[platform].title).join(', ')}
  </Text>
);

export const BuildArtifacts: React.FC<{ children?: never }> = () => {
  const dispatch = useDispatch();
  const onChange = useCallback((e, artifact: Binding) => dispatch(createActionArtifactToggle(artifact)), [dispatch]);
  const contents = useSelector(selectorContents);
  const availability = useSelector(selectorAvailability);
  const descriptions = useSelector(selectorDescriptions);
  const { byId: natives } = useSelector(selectorNatives);
  const { allIds, byId } = useSelector(selectorArtifacts);

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
};

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
      <Box css={{ mb: '$sm' }}>
        {artifact.natives &&
          artifact.natives !== NATIVE_ALL &&
          artifact.nativesOptional !== true &&
          getSupportedPlatforms(natives, artifact.natives, disabled)}
        <p dangerouslySetInnerHTML={{ __html: artifact.description }} />
        {artifact.website !== undefined && (
          <p>
            <Anchor href={artifact.website} rel="noopener external" target="_blank" css={{ wordBreak: 'break-all' }}>
              {artifact.website}
            </Anchor>
          </p>
        )}
      </Box>
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
