import React, { useMemo } from 'react';
import { useMemoSlice } from './Store';
import { Addon, AddonDefinition, BuildStore } from './types';
import { toggleAddon } from './actions';
import { Checkbox } from '~/components/Checkbox';
import { cx } from '@emotion/css';

const getSlice = ({ mode, selectedAddons, descriptions, addons }: BuildStore) => ({
  mode,
  selectedAddons,
  descriptions,
  allIds: addons.allIds,
  byId: addons.byId,
});

const getInputs = (state: BuildStore) => [state.mode, state.selectedAddons, state.descriptions];

export function BuildAddons() {
  const [slice, dispatch] = useMemoSlice(getSlice, getInputs);
  const { mode, selectedAddons, descriptions, allIds, byId } = slice;

  return useMemo(() => {
    const onChange = (addon: Addon) => dispatch(toggleAddon(addon));

    return (
      <div className="custom-controls-stacked">
        {allIds.map((it: Addon) => {
          const addon = byId[it];
          const disabled = addon.modes !== undefined && !addon.modes.includes(mode);

          return (
            <BuildAddon
              key={it}
              addon={addon}
              disabled={disabled}
              selected={selectedAddons.includes(it)}
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
  addon: AddonDefinition;
  disabled: boolean;
  selected: boolean;
  showDescriptions: boolean;
  onChange: any;
}

const BuildAddon = ({ addon, disabled, selected, showDescriptions, onChange }: Props) => {
  const label: string = `${addon.title} v${addon.maven.version}`;

  if (showDescriptions) {
    return (
      <div className={cx('artifact', { 'text-muted': disabled })}>
        <Checkbox
          value={addon.id}
          label={label}
          disabled={disabled}
          checked={!disabled && selected}
          onChange={onChange}
        />
        <p>{addon.description}</p>
        {addon.website && (
          <p>
            <a href={addon.website} target="_blank" rel="noopener">
              {addon.website}
            </a>
          </p>
        )}
      </div>
    );
  } else {
    return (
      <Checkbox
        value={addon.id}
        label={label}
        disabled={disabled}
        checked={!disabled && selected}
        onChange={onChange}
      />
    );
  }
};
