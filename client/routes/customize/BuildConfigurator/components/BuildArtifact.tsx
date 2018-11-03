import * as React from 'react';
import { Checkbox } from '~/components/Checkbox';
import IconApple from '~/components/icons/fa/brands/Apple';
import IconLinux from '~/components/icons/fa/brands/Linux';
import IconWindows from '~/components/icons/fa/brands/Windows';
import { Connect } from '~/store/Connect';
import { cc } from '~/theme';
import { NATIVE_ALL, NATIVE_LINUX, NATIVE_MAC, NATIVE_WIN } from '../constants';
import { toggleArtifact } from '../reducer';
import { BuildConfig, NATIVES } from '../types';
interface Props {
  id: string;
}

const getPlatformIcons = (platforms: Array<NATIVES>) => {
  return (
    <p>
      <em>Supported platforms: &nbsp;</em>
      {platforms.map(platform => {
        switch (platform) {
          case NATIVE_WIN:
            return <IconWindows key="fa-win" />;
          case NATIVE_MAC:
            return <IconApple key="fa-mac" />;
          case NATIVE_LINUX:
            return <IconLinux key="fa-linux" />;
          default:
            return null;
        }
      })}
    </p>
  );
};

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
