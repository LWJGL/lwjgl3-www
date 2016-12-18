import React from 'react'
import nprogress from 'nprogress'
import loadJS from 'fg-loadjs'
import LoaderSpinner from '../components/LoaderSpinner'

let firstRoute = true;

const asyncRoute = (getComponent) => class AsyncComponent extends React.Component {
  static Component = null;

  mounted = false;
  state = {
    Component: AsyncComponent.Component
  };

  componentDidMount() {
    this.mounted = true;
    document.documentElement.scrollTop = 0;
    if ( this.state.Component === null ) {
      if ( !firstRoute ) {
        nprogress.start();
      }
      getComponent().then((m) => m.default).then((Component) => {
        if ( firstRoute ) {
          firstRoute = false;
          if ( process.env.NODE_ENV === 'production' ) {
            loadJS('https://www.google-analytics.com/analytics.js');
          }
        } else {
          //noinspection JSUnresolvedFunction
          nprogress.done();
        }
        AsyncComponent.Component = Component;
        if ( this.mounted ) {
          this.setState({Component});
        }
      })
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const {Component} = this.state;

    if ( Component !== null ) {
      if ( process.env.NODE_ENV === 'production' ) {
        const {location} = this.props;
        ga('send', 'pageview', `${location.pathname}${location.search}`);
      }

      return <Component {...this.props} />
    } else {
      return (
        <div className="container text-xs-center" style={{padding:'25vh 0'}}>
          <LoaderSpinner size={128} delay={true} />
        </div>
      )
    }
  }
};

export const Home = asyncRoute(() => import('./home'));
export const Download = asyncRoute(() => import('./download'));
export const Guide = asyncRoute(() => import('./guide'));
export const Source = asyncRoute(() => import('./source'));
export const License = asyncRoute(() => import('./license'));
