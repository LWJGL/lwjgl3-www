// @flow
import * as React from 'react';
import { toggleArtifact } from '../reducer';
import { NATIVE_WIN, NATIVE_LINUX, NATIVE_MAC } from '../constants';
import { Checkbox } from '~/components/Checkbox';
import { Connect } from '~/store/Connect';
import { cc } from '~/theme';
import { FaLinux } from '~/components/icons/fa/linux';
import { FaWindows } from '~/components/icons/fa/windows';
import { FaApple } from '~/components/icons/fa/apple';

const getPlatformIcons = platforms => {
  return (
    <p>
      <em>Supported platforms: &nbsp;</em>
      {platforms.map(platform => {
        switch (platform) {
          case NATIVE_WIN:
            return <FaWindows key="fa-win" />;
          case NATIVE_MAC:
            return <FaApple key="fa-mac" />;
          case NATIVE_LINUX:
            return <FaLinux key="fa-linux" />;
          default:
            return null;
        }
      })}
    </p>
  );
};

import type { BuildConfig, BindingDefinition } from '../types';

type Props = {|
  id: string,
|};

export const BuildArtifact = ({ id }: Props) => (
  <Connect
    state={({ build }: { build: BuildConfig }) => {
      const artifact = build.artifacts.byId[id];

      return {
        artifact,
        checked: build.contents[artifact.id] && build.availability[artifact.id],
        showDescriptions: build.descriptions,
        disabled: artifact.required === true || !build.availability[artifact.id],
      };
    }}
    actions={{
      toggleArtifact,
    }}
  >
    {({ artifact, checked, disabled, showDescriptions }, { toggleArtifact }) => {
      if (showDescriptions) {
        return (
          <div className={cc('artifact', { 'text-muted': disabled })}>
            <Checkbox
              value={artifact.id}
              label={artifact.title}
              disabled={disabled}
              checked={checked}
              onChange={toggleArtifact}
            />
            {artifact.natives && getPlatformIcons(artifact.natives)}
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
          <Checkbox
            value={artifact.id}
            label={artifact.title}
            disabled={disabled}
            checked={checked}
            onChange={toggleArtifact}
          />
        );
      }
    }}
  </Connect>
);
