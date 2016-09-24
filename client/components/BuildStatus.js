import React from 'react'
import {StyleSheet, css} from 'aphrodite/no-important'
import LoaderSpinner from './LoaderSpinner'

const styles = StyleSheet.create({
  container: {
    minHeight: '2rem'
  },
  common: {
    display: 'inline-block',
    color: 'white',
    fontSize: 11,
    lineHeight: '20px',
    padding: '0 6px',
    fontFamily: 'DejaVu Sans,Verdana,Geneva,sans-serif',
    textShadow: '0 1px 0 rgba(1,1,1,.3)',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,.13), transparent)',
  },
  build: {
    backgroundColor: '#555',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  status: {
    backgroundColor: 'gray',
    transition: 'background-color 1s ease-out',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  loading: {
    backgroundColor: 'gray',
  },
  unknown: {
    backgroundColor: '#fff',
    color: '#555',
  },
  passing: {
    backgroundColor: '#4c1',
  },
  failing: {
    backgroundColor: '#db423c',
  },
});

export default class BuildStatus extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired
  };

  state = {
    status: 'loading'
  };

  componentDidMount() {
    this._isMounted = true;
    if ( process.env.NODE_ENV === 'production' ) {
      this.loadData();
    } else {
      this.setState({status: 'unknown'});
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async loadData() {
    let response;
    let result;

    try {
      response = await fetch(`/teamcity?build=${this.props.name}`);
      if ( response.status !== 200 ) {
        throw 1;
      }

      result = await response.json();

      if ( result.error ) {
        throw 1;
      }
    } catch(e) {
      if ( this._isMounted ) {
        this.setState({status: 'unknown'});
      }
      return;
    }

    if ( this._isMounted ) {
      if ( result.count === 1 && result.build[0].status === 'SUCCESS' ) {
        this.setState({status: 'passing', build: result.build[0].number});
      } else {
        this.setState({status: 'failing'});
      }
    }
  }

  render() {
    return (
      <div className={css(styles.container)}>
        <span className={css(styles.common, styles.build)}>build</span>
        <span className={css(styles.common, styles.status, styles[this.state.status])}>
          {this.state.status}
          {this.state.status === 'loading' ? <LoaderSpinner size={14} style={{marginLeft:4,stroke:'white'}} /> : null }
        </span>
        {this.state.build !== undefined ? (<small style={{color:'gray'}}> #{this.state.build}</small>) : null }
      </div>
    )
  }

};
