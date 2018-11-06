import * as React from 'react';
import { memo } from 'react';
import { StateMemo } from '~/components/StateMemo';
import { useStore, useStoreRef } from './Store';
import { Binding, BindingDefinition, Native, NATIVE_ALL } from './types';
import { toggleArtifact } from './actions';

// UI
import { Checkbox } from '~/components/Checkbox';
import { getPlatformIcon } from './getPlatformIcon';
import { cc } from '~/theme';

const getPlatformIcons = (platforms: Array<Native>) => (
  <p>
    <em>Supported platforms: &nbsp;</em>
    {platforms.map(platform => getPlatformIcon(platform))}
  </p>
);

export function BuildArtifacts() {
  const [state, dispatch] = useStore(({ contents, availability, descriptions }) => ({
    contents,
    availability,
    descriptions,
  }));

  const {
    artifacts: { allIds, byId },
  } = useStoreRef().current;

  const { contents, availability, descriptions: showDescriptions } = state;
  const onChange = (artifact: Binding) => dispatch(toggleArtifact(artifact));

  return (
    <StateMemo state={state}>
      <div className="custom-controls-stacked">
        {allIds.map((it: Binding) => {
          const artifact = byId[it] as BindingDefinition;
          const available = availability[it] === true;

          return (
            <BuildArtifact
              key={it}
              artifact={artifact}
              disabled={!available || artifact.required === true}
              selected={available && contents[it] === true}
              showDescriptions={showDescriptions}
              onChange={onChange}
            />
          );
        })}
      </div>
    </StateMemo>
  );
}

interface Props {
  artifact: BindingDefinition;
  disabled: boolean;
  selected: boolean;
  showDescriptions: boolean;
  onChange: any;
}

const BuildArtifact = memo(({ artifact, selected, disabled, showDescriptions, onChange }: Props) => {
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
          getPlatformIcons(artifact.natives)}
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
});
