import React from 'react'
import { css } from 'aphrodite/no-important'
import styles from '../styles'

class File extends React.PureComponent {

  render() {
    const parts = this.props.path.split('/');
    const name = parts[parts.length-1];
    const url = `https://build.lwjgl.org/${this.props.path}`;

    return (
      <tr>
        <td className={css(styles.file)}><b>{name}</b><br /><small>{url}</small></td>
        <td style={{textAlign:'right'}}>
          <a download={true} href={url} className="btn btn-sm btn-outline-info">Download</a>
        </td>
      </tr>
    );
  }

}

export default File
