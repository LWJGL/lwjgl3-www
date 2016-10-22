import React from 'react'
import BrowserRouter from 'react-router/BrowserRouter'
import Layout from './Layout'

const App = props => (
  <BrowserRouter>
    {
      ({ location/*, router*/ }) => <Layout location={location} store={props.store} />
    }
  </BrowserRouter>
);

App.propTypes = {
  store: React.PropTypes.object.isRequired
};

export default App;
