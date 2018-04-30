// @flow
// @jsx jsx
import * as React from 'react';
import jsx from '@emotion/jsx';
import css from '@emotion/css';

type Props = {|
  path: string,
|};

export const File = (props: Props) => {
  const url = `https://build.lwjgl.org/${props.path}`;

  return (
    <tr>
      <td
        css={css`
          word-break: break-all;
        `}
      >
        <b>{props.path.split('/').pop()}</b>
        <br />
        <small>{url}</small>
      </td>
      <td
        css={css`
          text-align: right;
        `}
      >
        <a download={true} href={url} className="btn btn-sm btn-outline-info">
          Download
        </a>
      </td>
    </tr>
  );
};
