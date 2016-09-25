import React from 'react'
import {BrowserRouter} from 'react-router'
import Root from './Root'

const App = () => (
  <BrowserRouter>
    {
      ({ location/*, router*/ }) => <Root location={location} />
    }
  </BrowserRouter>
);

export default App;