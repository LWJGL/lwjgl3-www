import asyncRoute from './asyncRoute'

// Used only during DEVELOPMENT to enable Hot Module Reloading
// NormalModuleReplacementPlugin forces use of RoutesAsync in PRODUCTION
const hmr = (route) => asyncRoute(() => Promise.resolve(route));

export const Home = hmr(require('./home'));
export const Download = hmr(require('./download'));
export const Guide = hmr(require('./guide'));
export const Source = hmr(require('./source'));
export const License = hmr(require('./license'));

