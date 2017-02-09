import asyncRoute from './asyncRoute'

// Import causes routes to be code-split
// We have to specify each route name/path in order to be statically analyzed by webpack

export const Home = asyncRoute(() => import('./home'));
export const Download = asyncRoute(() => import('./download'));
export const Guide = asyncRoute(() => import('./guide'));
export const Source = asyncRoute(() => import('./source'));
export const License = asyncRoute(() => import('./license'));
