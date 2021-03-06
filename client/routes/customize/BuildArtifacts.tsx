import { useCallback } from 'react';
import { Box } from '~/components/layout/Box';
import { Checkbox } from '~/components/forms/Selection';
import { Anchor } from '~/components/lwjgl/Anchor';
import { Text } from '~/components/ui/Text';
import { useSelector, useDispatch } from './Store';
import {
  createActionArtifactToggle,
  selectorContents,
  selectorAvailability,
  selectorDescriptions,
  selectorNatives,
  selectorArtifacts,
  selectorPlatformsSelected,
} from './reducer';

import type { Binding, BindingDefinition, Native, NativeMap } from './types';

const getSupportedPlatforms = (
  natives: NativeMap,
  platformsSelected: Native[],
  platforms: Array<Native>,
  disabled: boolean
) => {
  let missing = platformsSelected.filter((key) => !platforms.includes(key as Native)) as Native[];

  if (missing.length === 0) {
    return null;
  }

  if (missing.length >= platforms.length) {
    return (
      <Text css={{ color: disabled ? '$caution600' : '$caution500' }}>
        <em>* Supported platforms: </em>
        {platforms.map((platform) => natives[platform].title).join(', ')}
      </Text>
    );
  } else {
    return (
      <Text css={{ color: disabled ? '$critical600' : '$critical500' }}>
        <em>* Not available on: </em>
        {missing.map((platform) => natives[platform].title).join(', ')}
      </Text>
    );
  }
};

export const BuildArtifacts: React.FC<{ children?: never }> = () => {
  const dispatch = useDispatch();
  const onChange = useCallback((e, artifact: Binding) => dispatch(createActionArtifactToggle(artifact)), [dispatch]);
  const contents = useSelector(selectorContents);
  const availability = useSelector(selectorAvailability);
  const descriptions = useSelector(selectorDescriptions);
  const platformsSelected = useSelector(selectorPlatformsSelected);
  const { byId: natives } = useSelector(selectorNatives);
  const { allIds, byId } = useSelector(selectorArtifacts);

  const platformsSelectedArr = Object.keys(platformsSelected).filter(
    //@ts-ignore
    (key) => platformsSelected[key] === true
  ) as Native[];

  return (
    <>
      {allIds.map((it: Binding) => {
        const artifact = byId[it] as BindingDefinition;
        const available = availability[it] === true;

        return (
          <BuildArtifact
            key={it}
            natives={natives}
            platformsSelected={platformsSelectedArr}
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
  platformsSelected: Native[];
  artifact: BindingDefinition;
  disabled: boolean;
  selected: boolean;
  showDescriptions: boolean;
  onChange: any;
}

const BuildArtifact: React.FC<Props> = ({
  natives,
  platformsSelected,
  artifact,
  disabled,
  selected,
  showDescriptions,
  onChange,
}) => {
  if (showDescriptions) {
    const desc = (
      <Box css={{ mb: '$sm' }}>
        {artifact.natives &&
          artifact.nativesOptional !== true &&
          getSupportedPlatforms(natives, platformsSelected, artifact.natives, disabled)}
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
