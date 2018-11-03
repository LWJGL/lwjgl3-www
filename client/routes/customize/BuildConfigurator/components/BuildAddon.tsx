import * as React from 'react';
import { toggleAddon } from '../reducer';
import { BuildConfig } from '../types';
import { Checkbox } from '~/components/Checkbox';
import { Connect } from '~/store/Connect';
import { cc } from '~/theme';

interface Props {
  id: string;
}

export const BuildAddon = ({ id }: Props) => (
  <Connect
    state={({ build }: { build: BuildConfig }) => ({
      mode: build.mode,
      addon: build.addons.byId[id],
      checked: build.selectedAddons.includes(id),
      showDescriptions: build.descriptions,
    })}
    actions={{
      toggleAddon,
    }}
  >
    {({ addon, mode, checked, showDescriptions }, { toggleAddon }) => {
      const label: string = `${addon.title} v${addon.maven.version}`;
      const disabled = addon.modes !== undefined && !addon.modes.includes(mode);

      if (showDescriptions) {
        return (
          <div className={cc('artifact', { 'text-muted': disabled })}>
            <Checkbox
              value={addon.id}
              label={label}
              disabled={disabled}
              checked={!disabled && checked}
              onChange={toggleAddon}
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
            checked={!disabled && checked}
            onChange={toggleAddon}
          />
        );
      }
    }}
  </Connect>
);
