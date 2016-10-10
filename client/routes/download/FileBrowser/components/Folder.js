import React from 'react'
import { connect } from 'react-redux'
import { actions as $$ } from '../reducer'
import { css } from 'aphrodite/no-important'
import styles from '../styles'
import FaFolder from '../../../../icons/folder'

@connect(
  null,
  {
    loadPath: $$.loadPath
  }
)
class Folder extends React.PureComponent {

  clickHandle = () => {
    this.props.loadPath(this.props.path);
  };

  render() {
    const parts = this.props.path.split('/');
    const name = parts[parts.length-2];

    return (
      <tr>
        <th className={css(styles.folder)} colSpan={2} onClick={this.clickHandle}><FaFolder /> {name}</th>
      </tr>
    );
  }

}

export default Folder
