import * as React from 'react';
import { css } from 'aphrodite/no-important';
import styles from '../styles';

type Props = {
  path: string,
};

const File = (props: Props) => {
  const url = `https://build.lwjgl.org/${props.path}`;

  return (
    <tr>
      <td className={css(styles.file)}>
        <b>
          {props.path.split('/').pop()}
        </b>
        <br />
        <small>
          {url}
        </small>
      </td>
      <td style={{ textAlign: 'right' }}>
        <a download={true} href={url} className="btn btn-sm btn-outline-info">
          Download
        </a>
      </td>
    </tr>
  );
};

export default File;
