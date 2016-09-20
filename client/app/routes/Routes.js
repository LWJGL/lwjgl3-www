import App from '../components/App'
import nprogress from 'nprogress'

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
      getComponentWrap(nextState, componentModule => {
        if ( process.browser ) {
          if ( process.env.NODE_ENV === 'production' ) {
            if ( !firstRoute ) {
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
        } else {
          require('../../../server/routeChunk').setName(name);
        }

        cb(null, componentModule.default);
      });
    },
    onEnter() {
      if ( process.browser ) {
        if ( !firstRoute && !routes[name] ) {
          nprogress.start();
        }
      }
    }
  }
}

export default {
  childRoutes: [{
    path: '/',
    component: App,
    indexRoute: route('/', (s, cb) => System.import('./home').then(m => cb(m))),
    childRoutes: [
      route('download', (s, cb) => System.import('./download').then(m => cb(m))),
      route('guide', (s, cb) => System.import('./guide').then(m => cb(m))),
      route('source', (s, cb) => System.import('./source').then(m => cb(m))),
      route('license', (s, cb) => System.import('./license').then(m => cb(m))),
    ]
  }]
};