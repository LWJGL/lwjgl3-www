import { useMemo } from 'react';
import { useMemoSlice } from './Store';
import { NATIVE_ALL } from './types';
import type { Binding, BindingDefinition, Native, BuildStore } from './types';
import { toggleArtifact } from './actions';

// UI
import { Checkbox } from '~/components/Checkbox';
import { getPlatformIcon } from './getPlatformIcon';
import { cx } from '@emotion/css';

const getPlatformIcons = (platforms: Array<Native>) => (
  <p>
    <em>Supported platforms: &nbsp;</em>
    {platforms.map((platform) => getPlatformIcon(platform))}
  </p>
);

const getSlice = ({ contents, availability, descriptions, artifacts }: BuildStore) => ({
  contents,
  availability,
  descriptions,
  allIds: artifacts.allIds,
  byId: artifacts.byId,
});

const getInputs = (state: BuildStore) => [state.contents, state.availability, state.descriptions];

export function BuildArtifacts() {
  const [slice, dispatch] = useMemoSlice(getSlice, getInputs);
  const { contents, availability, descriptions, allIds, byId } = slice;

  return useMemo(() => {
    const onChange = (artifact: Binding) => dispatch(toggleArtifact(artifact));

    return (
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
              showDescriptions={descriptions}
              onChange={onChange}
            />
          );
        })}
      </div>
    );
  }, [slice]);
}

interface Props {
  artifact: BindingDefinition;
  disabled: boolean;
  selected: boolean;
  showDescriptions: boolean;
  onChange: any;
}

const BuildArtifact: React.FC<Props> = ({ artifact, selected, disabled, showDescriptions, onChange }) => {
  if (showDescriptions) {
    return (
      <div className={cx('artifact', { 'text-muted': disabled })}>
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
};
