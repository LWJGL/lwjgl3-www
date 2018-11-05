import * as React from 'react';
import { memo } from 'react';
import { useStore } from './Store';
import { Addon, AddonDefinition } from './types';
import { toggleAddon } from './actions';
import { Checkbox } from '~/components/Checkbox';
import { cc } from '~/theme';

export function BuildAddons() {
  const [state, dispatch] = useStore(state => ({
    addons: state.addons.allIds,
    byId: state.addons.byId,
    mode: state.mode,
    selectedAddons: state.selectedAddons,
    showDescriptions: state.descriptions,
  }));

  const { addons, byId, mode, selectedAddons, showDescriptions } = state;
  const onChange = (addon: Addon) => dispatch(toggleAddon(addon));

  return (
    <div className="custom-controls-stacked">
      {addons.map((it: Addon) => {
        const addon = byId[it];
        const disabled = addon.modes !== undefined && !addon.modes.includes(mode);

        return (
          <BuildAddon
            key={it}
            addon={addon}
            disabled={disabled}
            selected={selectedAddons.includes(it)}
            showDescriptions={showDescriptions}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}

interface Props {
  addon: AddonDefinition;
  disabled: boolean;
  selected: boolean;
  showDescriptions: boolean;
  onChange: any;
}

const BuildAddon = memo(({ addon, disabled, selected, showDescriptions, onChange }: Props) => {
  const label: string = `${addon.title} v${addon.maven.version}`;

  if (showDescriptions) {
    return (
      <div className={cc('artifact', { 'text-muted': disabled })}>
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
});
