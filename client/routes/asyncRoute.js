import React from 'react';
import PropTypes from 'prop-types';
import nprogress from 'nprogress';
import loadJS from 'fg-loadjs';
import LoaderSpinner from '../components/LoaderSpinner';

// Flag for first route loaded on page
// Use it to load Google Analytics and other deferred stuff
let firstRoute = true;

// Function that returns a High-Order Component (wrapped component) with common route logic
// TODO: Port as simple component as soon as React adds support for promise-based component
export default getComponent =>
  class AsyncComponent extends React.Component {
    // Store wrapped component here so next time we render it immediatelly
    static Component = null;

    // Remembers last scroll positions
    // TODO: We shouldn't allow infinite keys here, implement a *shared* LRU cache
    static scrollPositions = {};

    /*
      Props are coming from react-router's <Route />:
      https://reacttraining.com/react-router/web/api/Route/Route-props
    */
    static propTypes = {
      // https://reacttraining.com/react-router/web/api/history
      // https://github.com/ReactTraining/history
      history: PropTypes.shape({
        length: PropTypes.number,
        action: PropTypes.string,
        location: PropTypes.shape({
          pathname: PropTypes.string.isRequired,
          search: PropTypes.string,
          hash: PropTypes.string,
          state: PropTypes.object,
        }).isRequired,
        push: PropTypes.func,
        replace: PropTypes.func,
        go: PropTypes.func,
        goBack: PropTypes.func,
        goForward: PropTypes.func,
        block: PropTypes.func,
      }).isRequired,

      // https://reacttraining.com/react-router/web/api/location
      location: PropTypes.shape({
        key: PropTypes.string,
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string,
        hash: PropTypes.string,
        state: PropTypes.object,
      }).isRequired,

      // https://reacttraining.com/react-router/web/api/match
      match: PropTypes.shape({
        params: PropTypes.object,
        isExact: PropTypes.bool,
        path: PropTypes.string,
        url: PropTypes.string,
      }).isRequired,
    };

    // Flag to check if we are still mounted after async stuff finishes
    mounted = false;

    state = {
      Component: AsyncComponent.Component,
    };

    componentDidMount() {
      this.mounted = true;

      if (AsyncComponent.Component === null) {
        if (!firstRoute) {
          // Show GitHub-style loading bar on top of the viewport
          nprogress.start();
        }
        // Load Wrapped Component (code-split via webpack)
        getComponent().then(m => m.default).then(Component => {
          if (firstRoute) {
            // We want to handle scroll restoration on our own from now on
            if ('scrollRestoration' in window.history) {
              window.history.scrollRestoration = 'manual';
            }
            if (process.env.NODE_ENV === 'production') {
              loadJS('https://www.google-analytics.com/analytics.js');
            }
            firstRoute = false;
          } else {
            // Hide loading bar
            nprogress.done();
          }
          // Store reference to component in HOC
          AsyncComponent.Component = Component;
          // If we are still mounted re-render to display the wrapped component
          if (this.mounted) {
            this.setState({ Component }, this.analytics.bind(this));
          }
        });
      } else {
        this.analytics();
        const { history: { action }, location: { key = 'root' } } = this.props;
        // POP means user is going forward or backward in history, restore previous scroll position
        if (action === 'POP') {
          const pos = AsyncComponent.scrollPositions[key];
          if (pos) {
            scroll(pos[0], pos[1]);
            return;
          }
        }
      }

      if (this.props.location.hash.length === 0) {
        // Scroll to top of viewport
        scroll(0, 0);
      }
    }

    analytics() {
      const { location: { pathname, search } } = this.props;
      ga('send', 'pageview', `${pathname}${search}`);
    }

    componentWillUnmount() {
      // Remember scroll position so we can restore if we return to this view via browser history
      const { location: { key = 'root' } } = this.props;
      // AsyncComponent.scrollPositions[key] = [window.scrollX, window.scrollY];  // <-- Only supported in CSSOM browsers
      AsyncComponent.scrollPositions[key] = [window.pageXOffset, window.pageYOffset]; // IE9+ pageXOffset is alias of scrollX

      // Mark that we are no longer mounted to avoid setting state if the wrapped component still hasn't loaded
      this.mounted = false;
    }

    render() {
      const { Component } = this.state;

      // Check if wrapped component module has loaded and render it,
      // otherwise render a spinner
      return Component === null
        ? <div className="text-center" style={{ padding: '5rem 0' }}>
            <LoaderSpinner size={128} delay={true} />
          </div>
        : <Component {...this.props} />;
    }
  };
