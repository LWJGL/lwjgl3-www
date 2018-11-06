import * as React from 'react';
import { useBreakpoint } from '~/components/Breakpoint';
import IconContentCopy from '~/components/icons/md/ContentCopy';
import IconFileDownload from '~/components/icons/md/FileDownload';
import { StateMemo } from '~/components/StateMemo';
import { BuildToolbar } from './BuildToolbar';
import { copyToClipboard, generateScript, getSelectedPlatforms, mime } from './lib/script';
import { useStore } from './Store';
import {
  Addon,
  AddonMap,
  Binding,
  BindingMapUnsafe,
  BuildStoreSnapshot,
  BuildType,
  Language,
  ModeDefinition,
  Native,
  PlatformSelection,
  Version,
} from './types';

const ALLOW_DOWNLOAD = window.btoa !== undefined;

export interface State {
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

export function BuildScript(props: Props) {
  const [state] = useStore(
    (state): State => {
      // Artifacts
      const selected: Array<Binding> = [];

      state.artifacts.allIds.forEach(artifact => {
        if (state.contents[artifact] === true && state.availability[artifact] === true) {
          selected.push(artifact);
        }
      });

      // Addons
      const selectedAddons: Array<Addon> = [];
      state.selectedAddons.forEach(id => {
        const addon = state.addons.byId[id];
        if (addon.modes !== undefined && addon.modes.indexOf(state.mode) === -1) {
          return;
        }
        selectedAddons.push(id);
      });

      return {
        build: state.build as BuildType,
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
      };
    }
  );

  const { mode } = state;

  const {
    current,
    breakpoints: { sm, md },
  } = useBreakpoint();

  const preRef: React.RefObject<HTMLPreElement> = React.useRef(null);

  const labels = {
    download: `DOWNLOAD ${typeof mode.file === 'string' ? mode.file.toUpperCase() : 'FILE'}`,
    copy: ' COPY TO CLIPBOARD',
  };

  if (current < sm) {
    labels.download = 'DOWNLOAD';
    labels.copy = '';
  } else if (current < md) {
    labels.copy = ' COPY';
  }

  const script = generateScript(mode.id, state);

  return (
    <StateMemo state={state}>
      <div>
        <h2 className="mt-1">
          <img src={mode.logo} alt={mode.title} style={{ height: 60 }} />
        </h2>
        <pre ref={preRef} className="m-0">
          <code>{script}</code>
        </pre>
        <BuildToolbar configDownload={props.configDownload} configLoad={props.configLoad}>
          {ALLOW_DOWNLOAD && (
            <a
              className="btn btn-success"
              download={mode.file}
              href={`data:${mime(mode)};base64,${btoa(script)}`}
              title={`Download ${mode.id} code snippet`}
            >
              <IconFileDownload /> {labels.download}
            </a>
          )}
          <button
            className="btn btn-success"
            onClick={() => copyToClipboard(preRef)}
            disabled={!document.execCommand}
            title="Copy to clipboard"
          >
            <IconContentCopy />
            {labels.copy}
          </button>
        </BuildToolbar>
      </div>
    </StateMemo>
  );
}
