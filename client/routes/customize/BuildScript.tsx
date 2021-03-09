import { useRef } from 'react';
import { styled } from '~/theme/stitches.config';
import { Button } from '~/components/forms/Button';
import { AnchorButton } from '~/components/ui/LinkButton';
import { useSelector } from './Store';
import { createSelectorDeepEqual } from '~/services/selector';
import { BuildToolbar } from './BuildToolbar';
import { useBreakpoint, Breakpoint } from '~/app/context/Breakpoint';
import { copyToClipboard, generateScript, getSelectedPlatforms, mime } from './lib/script';
import { Text } from '~/components/ui/Text';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/duotone/cloud-download';
import '~/theme/icons/fa/duotone/copy';
import { BuildType } from './types';

import type {
  BuildStore,
  Addon,
  AddonMap,
  Binding,
  BindingMapUnsafe,
  BuildStoreSnapshot,
  ModeDefinition,
  Version,
  Language,
  PlatformSelection,
  Native,
} from './types';

export interface ScriptState {
  build: BuildType;
  mode: ModeDefinition;
  version: Version;
  hardcoded: boolean;
  compact: boolean;
  osgi: boolean;
  language: Language;
  platform: PlatformSelection;
  platformSingle: Native | null;
  artifacts: BindingMapUnsafe;
  selected: Array<Binding>;
  addons: AddonMap;
  selectedAddons: Array<Addon>;
}

interface Props {
  configDownload: (event: React.MouseEvent<HTMLButtonElement>) => void;
  configLoad: (payload: BuildStoreSnapshot) => void;
}

const ALLOW_DOWNLOAD = window.btoa !== undefined;

const ScriptLogo = styled('img', {
  height: 60,
  variants: {
    flipOnDark: {
      true: {
        '.dark &': {
          filter: 'invert(90%)',
        },
      },
    },
  },
});

const Pre = styled('pre', {
  maxWidth: 'calc(100vw - 3.6rem)',
  overflow: 'auto',
  padding: '$gutter',
  backgroundColor: '$caution50',
  border: '1px solid $gray700',
  fontSize: '$sm',
});

const selector = createSelectorDeepEqual(
  (state: BuildStore) => {
    // Artifacts
    const selected: Array<Binding> = [];

    state.artifacts.allIds.forEach((artifact) => {
      if (state.contents[artifact] === true && state.availability[artifact] === true) {
        selected.push(artifact);
      }
    });

    // Addons
    const selectedAddons: Array<Addon> = [];

    state.selectedAddons.forEach((id) => {
      const addon = state.addons.byId[id];
      if (addon.modes === undefined || addon.modes.indexOf(state.mode) > -1) {
        selectedAddons.push(id);
      }
    });

    return {
      build: state.build,
      mode: state.modes.byId[state.mode],
      version: state.artifacts.version,
      hardcoded: state.hardcoded,
      compact: state.compact,
      osgi: state.osgi && state.build === BuildType.Release && parseInt(state.version.replace(/\./g, ''), 10) >= 312,
      language: state.language,
      platform: state.platform,
      platformSingle: getSelectedPlatforms(state.natives.allIds, state.platform),
      artifacts: state.artifacts.byId as BindingMapUnsafe,
      selected,
      addons: state.addons.byId,
      selectedAddons,
    } as ScriptState;
  },
  (data) => data
);

export function BuildScript({ configDownload, configLoad }: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const currentBreakpoint = useBreakpoint();

  const slice = useSelector(selector);
  const { mode } = slice;

  const labels = {
    download: `DOWNLOAD ${typeof mode.file === 'string' ? mode.file.toUpperCase() : 'FILE'}`,
    copy: ' COPY TO CLIPBOARD',
  };

  if (currentBreakpoint < Breakpoint.sm) {
    labels.download = 'DOWNLOAD';
    labels.copy = '';
  } else if (currentBreakpoint < Breakpoint.md) {
    labels.copy = ' COPY';
  }

  const script = generateScript(mode.id, slice);

  return (
    <>
      <Text
        as="h2"
        css={{
          mt: '$gutter',
          when: {
            sm: {
              mt: '1rem',
            },
          },
        }}
      >
        <ScriptLogo flipOnDark={mode.id === 'maven'} src={mode.logo} alt={mode.title} />
      </Text>
      <Pre ref={preRef}>
        <code>{script}</code>
      </Pre>
      <BuildToolbar configDownload={configDownload} configLoad={configLoad}>
        {ALLOW_DOWNLOAD && (
          <AnchorButton
            download={mode.file}
            href={`data:${mime(mode)};base64,${btoa(script)}`}
            title={`Download ${mode.id} code snippet`}
          >
            <Icon name="fa/duotone/cloud-download" /> {labels.download}
          </AnchorButton>
        )}
        <Button onClick={() => copyToClipboard(preRef)} disabled={!document.execCommand} title="Copy to clipboard">
          <Icon name="fa/duotone/copy" />
          {labels.copy}
        </Button>
      </BuildToolbar>
    </>
  );
}
