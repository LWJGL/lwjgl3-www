// @flow
import * as React from 'react';
import { toggleAddon } from '../reducer';
import { MODE_ZIP } from '../constants';
import type { BuildConfig, MODES, Addon } from '../types';
import Checkbox from '~/components/Checkbox';
import Connect from '~/store/Connect';
import cc from 'classcat';

type Props = {|
  id: string,
|};

const BuildAddon = ({ id }: Props) => (
  <Connect
    state={({ build }: { build: BuildConfig }) => {
      const addon: Addon = build.addons.byId[id];

      return {
        mode: build.mode,
        addon,
        checked: build.selectedAddons.includes(id),
        showDescriptions: build.descriptions,
      };
    }}
    actions={{
      toggleAddon,
    }}
  >
    {({ addon, mode, checked, showDescriptions }, { toggleAddon }) => {
      const label: string = `${addon.title} v${addon.maven.version}`;
      const disabled = addon.modes !== undefined && addon.modes.indexOf(mode) === -1;

      if (showDescriptions) {
        return (
          <div className={cc(['artifact', { 'text-muted': disabled }])}>
            <Checkbox
              value={addon.id}
              label={label}
              disabled={disabled}
              checked={checked && !disabled}
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
            checked={checked && !disabled}
            onChange={toggleAddon}
          />
        );
      }
    }}
  </Connect>
);

export default BuildAddon;
