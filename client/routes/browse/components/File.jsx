// @flow
import * as React from 'react';
import { css } from 'emotion';

type Props = {|
  path: string,
|};

const WordBreakAll = css`
  word-break: break-all;
`;
const TextRight = css`
  text-align: right;
`;

export const File = (props: Props) => {
  const url = `https://build.lwjgl.org/${props.path}`;

  return (
    <tr>
      <td className={WordBreakAll}>
        <b>{props.path.split('/').pop()}</b>
        <br />
        <small>{url}</small>
      </td>
      <td className={TextRight}>
        <a download={true} href={url} className="btn btn-sm btn-outline-info">
          Download
        </a>
      </td>
    </tr>
  );
};
