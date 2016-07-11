import App from '../components/App'

export default {
  childRoutes: [{
    path: '/',
    component: App,
    indexRoute: require('./home'),
    childRoutes: [
      require('./download'),
      require('./guide'),
      require('./license'),
      require('./source'),
    ]
  }]
};
