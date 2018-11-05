import * as React from 'react';
import { memo } from 'react';
import { useStore } from './Store';
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
  const [state, dispatch] = useStore(state => ({
    artifacts: state.artifacts.allIds,
    byId: state.artifacts.byId,
    contents: state.contents,
    availability: state.availability,
    showDescriptions: state.descriptions,
  }));

  const { artifacts, byId, contents, availability, showDescriptions } = state;
  const onChange = (artifact: Binding) => dispatch(toggleArtifact(artifact));

  return (
    <div className="custom-controls-stacked">
      {artifacts.map((it: Binding) => {
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
