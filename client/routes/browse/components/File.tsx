import React from 'react';

interface Props {
  path: string;
}

export const File = ({ path }: Props) => {
  const url = `https://build.lwjgl.org/${path}`;

  return (
    <tr>
      <td className="text-break">
        <b>{path.split('/').pop()}</b>
        <br />
        <small>{url}</small>
      </td>
      <td className="text-right">
        <a download={true} href={url} className="btn btn-sm btn-outline-info">
          Download
        </a>
      </td>
    </tr>
  );
};
