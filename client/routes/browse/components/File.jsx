// @flow
import * as React from 'react';
import styled from 'react-emotion';

type Props = {
  path: string,
};

const FileTitle = styled('td')`
  word-break: break-all;
`;
const FileActions = styled('td')`
  text-align: right;
`;

export const File = (props: Props) => {
  const url = `https://build.lwjgl.org/${props.path}`;

  return (
    <tr>
      <FileTitle>
        <b>{props.path.split('/').pop()}</b>
        <br />
        <small>{url}</small>
      </FileTitle>
      <FileActions>
        <a download={true} href={url} className="btn btn-sm btn-outline-info">
          Download
        </a>
      </FileActions>
    </tr>
  );
};
