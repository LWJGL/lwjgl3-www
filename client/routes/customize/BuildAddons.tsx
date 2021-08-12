import { useCallback } from 'react';
import { Box } from '~/components/ui/Box';
import { Checkbox } from '~/components/forms/Selection';
import { Anchor } from '~/components/lwjgl/Anchor';
import { useSelector, useDispatch } from './Store';
import {
  createActionAddonToggle,
  selectorMode,
  selectorAddons,
  selectorAddonsSelected,
  selectorDescriptions,
} from './reducer';

import type { Addon, AddonDefinition } from './types';

export const BuildAddons: React.FC<{ children?: never }> = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectorMode);
  const { allIds, byId } = useSelector(selectorAddons);
  const selectedAddons = useSelector(selectorAddonsSelected);
  const descriptions = useSelector(selectorDescriptions);
  const onChange = useCallback((e, addon: Addon) => dispatch(createActionAddonToggle(addon)), [dispatch]);

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
};

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
      <Box css={{ mb: '$sm' }}>
        <p>{addon.description}</p>
        {addon.website && (
          <p>
            <Anchor href={addon.website} rel="noopener external" target="_blank">
              {addon.website}
            </Anchor>
          </p>
        )}
      </Box>
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
