import { useMemo, useCallback } from 'react';
import { useMemoSlice } from './Store';
import type { Addon, AddonDefinition, BuildStore } from './types';
import { toggleAddon } from './actions';

// UI
import { Checkbox } from '~/components/forms/Selection';
import { Anchor } from '~/components/lwjgl/Anchor';

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
  const onChange = useCallback((e, addon: Addon) => dispatch(toggleAddon(addon)), [dispatch]);

  return useMemo(() => {
    const { mode, selectedAddons, descriptions, allIds, byId } = slice;

    return (
      <>
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
      </>
    );
  }, [slice, onChange]);
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
    const desc = (
      <>
        <p>{addon.description}</p>
        {addon.website && (
          <p>
            <Anchor href={addon.website} target="_blank">
              {addon.website}
            </Anchor>
          </p>
        )}
      </>
    );

    return (
      <Checkbox
        description={desc}
        value={addon.id}
        disabled={disabled}
        checked={!disabled && selected}
        onChange={onChange}
      >
        {label}
      </Checkbox>
    );
  } else {
    return (
      <Checkbox value={addon.id} disabled={disabled} checked={!disabled && selected} onChange={onChange}>
        {label}
      </Checkbox>
    );
  }
};
