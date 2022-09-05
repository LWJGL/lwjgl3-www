import { useCallback } from 'react';
import { Box } from '~/components/ui/Box';
import { LazyOffscreen } from '~/components/ui/LazyOffscreen';
import { Checkbox, type CheckboxProps } from '~/components/forms/Selection';
import { Anchor } from '~/components/lwjgl/Anchor';
import { Text } from '~/components/ui/Text';
import { useStore, useDispatch } from './store';
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
      <Text css={{ color: disabled ? '$caution6' : '$caution5' }}>
        <em>* Supported platforms: </em>
        {platforms.map((platform) => natives[platform].title).join(', ')}
      </Text>
    );
  } else {
    return (
      <Text css={{ color: disabled ? '$critical6' : '$critical5' }}>
        <em>* Not available on: </em>
        {missing.map((platform) => natives[platform].title).join(', ')}
      </Text>
    );
  }
};

export const BuildArtifacts: React.FC<{ children?: never }> = () => {
  const dispatch = useDispatch();
  const onChange: CheckboxProps['onChange'] = useCallback(
    (e, artifact: Binding) => dispatch(createActionArtifactToggle(artifact)),
    [dispatch]
  );
  const contents = useStore(selectorContents);
  const availability = useStore(selectorAvailability);
  const descriptions = useStore(selectorDescriptions);
  const platformsSelected = useStore(selectorPlatformsSelected);
  const { byId: natives } = useStore(selectorNatives);
  const { allIds, byId } = useStore(selectorArtifacts);

  const platformsSelectedArr = Object.keys(platformsSelected).filter(
    //@ts-expect-error
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

interface PropsDesc {
  natives: NativeMap;
  platformsSelected: Native[];
  artifact: BindingDefinition;
  disabled: boolean;
}

interface Props extends PropsDesc {
  selected: boolean;
  showDescriptions: boolean;
  onChange: CheckboxProps['onChange'];
}

const BuildArtifactDescription: React.FC<PropsDesc> = ({ natives, platformsSelected, artifact, disabled }) => {
  return (
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
};

const BuildArtifact: React.FC<Props> = ({
  natives,
  platformsSelected,
  artifact,
  disabled,
  selected,
  showDescriptions,
  onChange,
}) => {
  return (
    <Checkbox
      description={
        <LazyOffscreen mode={showDescriptions ? 'visible' : 'hidden'}>
          <BuildArtifactDescription
            natives={natives}
            platformsSelected={platformsSelected}
            artifact={artifact}
            disabled={disabled}
          />
        </LazyOffscreen>
      }
      value={artifact.id}
      disabled={disabled}
      checked={selected}
      onChange={onChange}
    >
      {artifact.title}
    </Checkbox>
  );
};
