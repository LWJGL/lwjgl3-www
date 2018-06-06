import { setConfig, cold, hot } from 'react-hot-loader';
import App from './containers/App';

setConfig({
  onComponentRegister: (type, name, file) => file.indexOf('node_modules') > 0 && cold(type),
});

export default hot(module)(App);
