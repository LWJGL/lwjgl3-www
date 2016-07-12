import App from '../components/App'
import nprogress from 'nprogress'
import ga from '../utils/ga'

const routes = {};
let firstRoute = true;

// Router middleware
//    Handles Google Analytics pageview tracking
//    Handles nprogress toggling
//    We use System.import for webpack tree shaking and code splitting
function route(name, getComponentWrap) {
  if ( typeof routes[name] === 'undefined' ) {
    routes[name] = false;
  }

  return {
    path: name === '/' ? undefined : name,
    getComponent(nextState, cb) {
      getComponentWrap(nextState, (err, module) => {
        if ( !firstRoute ) {
          if ( process.env.NODE_ENV === 'production' ) {
            ga('send', 'pageview', `${nextState.location.pathname}${nextState.location.search}`);
          }
        }

        if ( routes[name] === false ) {
          routes[name] = true;

          if ( firstRoute ) {
            firstRoute = false;
          } else {
            nprogress.done();
          }
        }

        cb(null, module.default);
      });
    },
    onEnter() {
      if ( !firstRoute && !routes[name] && process.browser ) {
        nprogress.start();
      }
    }
  }
}

export default {
  childRoutes: [{
    path: '/',
    component: App,
    indexRoute: route('/', (s, cb) => System.import('./home').then(m => cb(null, m))),
    childRoutes: [
      route('download', (s, cb) => System.import('./download').then(m => cb(null, m))),
      route('guide', (s, cb) => System.import('./guide').then(m => cb(null, m))),
      route('source', (s, cb) => System.import('./source').then(m => cb(null, m))),
      route('license', (s, cb) => System.import('./license').then(m => cb(null, m))),
    ]
  }]
};