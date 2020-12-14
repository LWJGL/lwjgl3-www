import { useState } from 'react';
import { BuildAddons } from './BuildAddons';
import { BuildArtifacts } from './BuildArtifacts';
import { BuildConfigArea } from './BuildConfigArea';
import { BuildDownloaderDialog } from './BuildDownloaderDialog';
import { BuildFooter } from './BuildFooter';
import { BuildPanel } from './BuildPanel';
import { BuildPlatform } from './BuildPlatform';
import { BuildReleaseNotes } from './BuildReleaseNotes';
import { ControlledCheckbox } from './ControlledCheckbox';
import { ControlledPanel } from './ControlledPanel';
import { ControlledRadio } from './ControlledRadio';
import { ControlledToggle } from './ControlledToggle';
import { fields, hasLanguageOption, isBuildRelease, isBuildSelected } from './fields';
import { BuildType, BuildStore } from './types';
import { Grid } from '~/components/layout/Grid';
import { ControlStack } from '~/components/forms/ControlStack';
import { useMemoSlice } from './Store';

export function BuildConfigurator() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [slice] = useMemoSlice(
    ({ descriptions }: BuildStore) => ({
      descriptions,
    }),
    (state: BuildStore) => [state.descriptions]
  );

  return (
    <>
      <Grid
        css={{
          mb: '$gutter',
          gap: '$safe',
          px: '$safe',
          lg: {
            grid: 'auto / 1fr 1fr 1fr',
          },
        }}
      >
        <BuildPanel build={BuildType.Release} />
        <BuildPanel build={BuildType.Stable} />
        <BuildPanel build={BuildType.Nightly} />
      </Grid>
      <ControlledPanel predicate={isBuildSelected}>
        <BuildConfigArea>
          <ControlledToggle spec={fields.descriptions} />

          <Grid
            css={{
              mt: '$sm',
              gap: '$gutter',
              alignItems: 'start',
              gridTemplateRows: 'minmax(0, min-content)',
              sm: {
                gridTemplateColumns: '1fr 1fr',
              },
              lg: {
                gridTemplateColumns: '1fr 1fr 2fr',
              },
            }}
          >
            <Grid css={{ gap: '$gutter' }}>
              <ControlStack>
                <h4>Mode</h4>
                <ControlledRadio spec={fields.mode} />
              </ControlStack>

              <ControlStack>
                <h4>Options</h4>
                <ControlledCheckbox spec={fields.source} />
                <ControlledCheckbox spec={fields.javadoc} />
                <ControlledCheckbox spec={fields.includeJSON} />
                <ControlledToggle spec={fields.hardcoded} />
                <ControlledToggle spec={fields.compact} />
                <ControlledToggle spec={fields.osgi} />
              </ControlStack>

              <ControlStack>
                <BuildPlatform />
              </ControlStack>

              <ControlledPanel predicate={hasLanguageOption}>
                <ControlStack>
                  <h4>Language</h4>
                  <ControlledRadio spec={fields.language} />
                </ControlStack>
              </ControlledPanel>
            </Grid>

            <Grid css={{ gap: '$gutter' }}>
              <ControlStack>
                <h4>Presets</h4>
                <ControlledRadio spec={fields.preset} />
              </ControlStack>

              <ControlStack
                css={{
                  sm: {
                    gap: slice.descriptions ? '$sm' : '$xxsm',
                  },
                }}
              >
                <h4>Addons</h4>
                <BuildAddons />
              </ControlStack>

              <ControlledPanel predicate={isBuildRelease}>
                <ControlStack>
                  <h4>Version</h4>
                  <ControlledRadio spec={fields.version} />
                  <BuildReleaseNotes />
                </ControlStack>
              </ControlledPanel>
            </Grid>

            <ControlStack
              css={{
                sm: {
                  gap: slice.descriptions ? '$sm' : '$xxsm',
                  gridArea: ' 1 / 2 / span 2 / span 1',
                },
                lg: {
                  gridArea: 'auto',
                },
              }}
            >
              <h4>Contents</h4>
              <BuildArtifacts />
            </ControlStack>
          </Grid>
          <BuildFooter setIsDownloading={setIsDownloading} />
        </BuildConfigArea>
      </ControlledPanel>
      {isDownloading && <BuildDownloaderDialog setIsDownloading={setIsDownloading} />}
    </>
  );
}
