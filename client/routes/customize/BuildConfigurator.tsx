import { useRef } from 'react';
import { BuildType, type DownloadHandle } from './types';
import { Grid } from '~/components/layout/Grid';
import { BuildPanel } from './BuildPanel';
import { ControlStack } from '~/components/forms/ControlStack';
import { ControlledPanel } from './ControlledPanel';
import { ConnectedCheckbox } from './ConnectedCheckbox';
import { ConnectedRadio } from './ConnectedRadio';
import { fields, selectorHasLanguageOption, selectorIsBuildRelease, selectorIsBuildSelected } from './reducer';

import { BuildPlatform } from './BuildPlatform';
import { BuildAddons } from './BuildAddons';
import { BuildReleaseNotes } from './BuildReleaseNotes';
import { BuildArtifacts } from './BuildArtifacts';
import { BuildDownloader } from './BuildDownloader';
import { BuildFooter } from './BuildFooter';

import { styled } from '~/theme/stitches.config';

export const BuildConfigArea = styled('div', {
  zIndex: 0,
  mb: 100,
  pl: '$gutter',
  pr: '$gutter',
  h4: {
    fontSize: '$xl',
    fontWeight: '$medium',
  },
  '@md': {
    ml: '$gutter',
    mr: '$gutter',
  },
  '@lg': {
    backgroundColor: '$accent3',
    border: '2px solid $accent12',
    '.dark &': {
      borderColor: '$accent1',
    },
    py: '$gutter',
  },
});

export const BuildConfigurator: React.FC<{ children?: never }> = () => {
  const downloadRef = useRef<DownloadHandle>(null);

  return (
    <>
      <Grid
        css={{
          gap: '$safe',
          mb: '$gutter',
          px: '$safe',
          '@lg': {
            grid: 'auto / 1fr 1fr',
          },
        }}
      >
        <BuildPanel build={BuildType.Release} />
        <BuildPanel build={BuildType.Nightly} />
      </Grid>
      <ControlledPanel predicate={selectorIsBuildSelected}>
        <BuildConfigArea>
          <ConnectedCheckbox variant="switch" {...fields.descriptions} />

          <Grid
            css={{
              mt: '$sm',
              gap: '$gutter',
              alignItems: 'start',
              gridTemplateRows: 'minmax(0, min-content)',
              '@sm': {
                gridTemplateColumns: '1fr 1fr',
              },
              '@lg': {
                gridTemplateColumns: '1fr 1fr 2fr',
              },
            }}
          >
            <Grid css={{ gap: '$gutter' }}>
              <ControlStack>
                <h4>Mode</h4>
                <ConnectedRadio {...fields.mode} />
              </ControlStack>

              <ControlStack>
                <h4>Options</h4>
                <ConnectedCheckbox {...fields.source} />
                <ConnectedCheckbox {...fields.javadoc} />
                <ConnectedCheckbox {...fields.includeJSON} />
                <ConnectedCheckbox variant="switch" {...fields.hardcoded} />
                <ConnectedCheckbox variant="switch" {...fields.compact} />
                <ConnectedCheckbox variant="switch" {...fields.osgi} />
              </ControlStack>

              <ControlStack>
                <BuildPlatform />
              </ControlStack>

              <ControlledPanel predicate={selectorHasLanguageOption}>
                <ControlStack>
                  <h4>Language</h4>
                  <ConnectedRadio {...fields.language} />
                </ControlStack>
              </ControlledPanel>
            </Grid>
            <Grid css={{ gap: '$gutter' }}>
              <ControlStack>
                <h4>Presets</h4>
                <ConnectedRadio {...fields.preset} />
              </ControlStack>
              <ControlStack
                css={{
                  '@sm': {
                    gap: '$xxsm',
                  },
                }}
              >
                <h4>Addons</h4>
                <BuildAddons />
              </ControlStack>

              <ControlledPanel predicate={selectorIsBuildRelease}>
                <ControlStack>
                  <h4>Version</h4>
                  <ConnectedRadio {...fields.version} />
                  <BuildReleaseNotes />
                </ControlStack>
              </ControlledPanel>
            </Grid>

            <ControlStack
              css={{
                '@sm': {
                  gap: '$xxsm',
                  gridArea: ' 1 / 2 / span 2 / span 1',
                },
                '@lg': {
                  gridArea: 'auto',
                },
              }}
            >
              <h4>Contents</h4>
              <BuildArtifacts />
            </ControlStack>
          </Grid>
          <BuildFooter downloadRef={downloadRef} />
        </BuildConfigArea>
      </ControlledPanel>
      <BuildDownloader ref={downloadRef} />
    </>
  );
};
