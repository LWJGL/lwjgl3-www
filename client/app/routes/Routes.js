import App from '../components/App'

export default {
  childRoutes: [{
    path: '/',
    component: App,
    indexRoute: require('./home').default,
    childRoutes: [
      require('./download').default,
      require('./guide').default,
      require('./source').default,
      require('./license').default,
    ]
  }]
};
