// @jsx jsx
import * as React from 'react';
import { jsx, css } from '@emotion/core';
jsx;

interface Props {
  path: string;
}

export const File = ({ path }: Props) => {
  const url = `https://build.lwjgl.org/${path}`;

  return (
    <tr>
      <td
        css={css`
          word-break: break-all;
        `}
      >
        <b>{path.split('/').pop()}</b>
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
