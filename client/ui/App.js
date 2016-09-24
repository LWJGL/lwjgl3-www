import React from 'react'
import {BrowserRouter} from 'react-router'
import Layout from './Layout'

const App = () => (
  <BrowserRouter>
    {
      ({ location/*, router*/ }) => <Layout location={location} />
    }
  </BrowserRouter>
);

export default App;