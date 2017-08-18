import * as React from 'react';
import { connect } from 'react-redux';
import Checkbox from '~/components/Checkbox';
import { toggleArtifact } from '../reducer';
import classnames from 'classnames';
import { NATIVE_WIN, NATIVE_LINUX, NATIVE_MAC } from '../constants';

import IconWindows from 'react-icons/fa/windows';
import IconLinux from 'react-icons/fa/linux';
import IconMacos from 'react-icons/fa/apple';

const getPlatformIcons = platforms => {
  return (
    <p>
      <em>Supported platforms: &nbsp;</em>
      {platforms.map(platform => {
        switch (platform) {
          case NATIVE_WIN:
            return <IconWindows key="fa-win" />;
          case NATIVE_MAC:
            return <IconMacos key="fa-mac" />;
          case NATIVE_LINUX:
            return <IconLinux key="fa-linux" />;
          default:
            return null;
        }
      })}
    </p>
  );
};

type OwnProps = {
  id: string,
};

import type { BindingDefinition } from '../types';

type ConnectedProps = {
  toggleArtifact: typeof toggleArtifact,
  artifact: BindingDefinition,
  checked: boolean,
  disabled: boolean,
  showDescriptions: boolean,
};

type Props = OwnProps & ConnectedProps;

class BuildArtifact extends React.Component<Props> {
  toggle = () => {
    this.props.toggleArtifact(this.props.id);
  };

  render() {
    const { artifact, checked, disabled, showDescriptions } = this.props;

    if (showDescriptions) {
      return (
        <div className={classnames('artifact', { 'text-muted': disabled })}>
          <Checkbox label={artifact.title} disabled={disabled} checked={checked} onChange={this.toggle} />
          {artifact.natives && getPlatformIcons(artifact.natives)}
          <p>
            {artifact.description}
          </p>
          {artifact.website &&
            <p>
              <a href={artifact.website} target="_blank">
                {artifact.website}
              </a>
            </p>}
        </div>
      );
    } else {
      return <Checkbox label={artifact.title} disabled={disabled} checked={checked} onChange={this.toggle} />;
    }
  }
}

export default connect(
  ({ build }, ownProps) => {
    const artifact = build.artifacts.byId[ownProps.id];

    return {
      artifact,
      checked: build.availability[artifact.id] && build.contents[artifact.id],
      showDescriptions: build.descriptions,
      disabled: !build.availability[artifact.id] || artifact.required,
    };
  },
  {
    toggleArtifact,
  }
)(BuildArtifact);
