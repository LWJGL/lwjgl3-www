import React from 'react'
import { connect } from 'react-redux'
import { actions as $$ } from '../reducer'
import LoaderSpinner from '../../../../components/LoaderSpinner'
import Folder from './Folder'
import File from './File'
import { css } from 'aphrodite/no-important'
import styles from '../styles'

@connect(
  (state) => {
    return {
      ...state.browser.contents[state.browser.path],
      path: state.browser.path,
    }
  },
  {
    loadPath: $$.loadPath,
  }
)
class Browser extends React.Component {

  componentDidMount() {
    this.props.loadPath(this.props.path);
  }

  goBack = () => {
    this.props.loadPath(this.props.parent);
  };

  render() {
    const props = this.props;
    const path = props.path === '/' ? '' : props.path;

    return (
      <table className="table">
        <thead className="thead-inverse">
        <tr>
          <th colSpan={2}>lwjgl/{path}</th>
        </tr>
        </thead>
        <tbody>
        {
          props.parent && (
            <tr>
              <th className={css(styles.folder)} scope="row" onClick={this.goBack} colSpan={2}>&hellip;</th>
            </tr>
          )
        }
        {
          props.folders.map((folder) => <Folder key={`${path}${folder}`} path={`${path}${folder}`} />)
        }
        {
          props.files.map((file) => <File key={`${path}${file}`} path={`${path}${file}`} />)
        }
        {
          props.loading && (
            <tr>
              <th scope="row" colSpan={2}><LoaderSpinner /></th>
            </tr>
          )
        }
        </tbody>
      </table>
    );
  }

}

export default Browser
