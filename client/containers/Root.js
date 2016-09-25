import React, { PropTypes } from 'react'
import {calculateResponsiveState} from 'redux-responsive'

import Layout from './Layout'
import configureStore from '../store/configureStore'

const store = configureStore();

if ( process.browser ) {
  store.dispatch(calculateResponsiveState(window));
}

const Root = ({location}) => (
  <Layout location={location} store={store} />
);

Root.propTypes = {
  location: PropTypes.object.isRequired
};

export default Root;
