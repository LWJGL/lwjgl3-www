# [LWJGL.org](https://www.lwjgl.org) - The home of Lightweight Java Game Library 3

The website for LWJGL 3 is build with React. It is a single-page application with client-side routing. It installs a Service Worker in order to work offline.

There is no server-side rendering because of hosting constraints.

Notable features:

- Client-side routing
- Service Worker (works offline)
- Tiny production build (entire codebase + content weights less than 350KB gzipped)
- Code splitting at route & component level
- Scroll restoration
- Route preloading
- Proximity based route preloading (see /download page)
- Build Customizer with smart download queue & client-side ZIP generator
- Optional hot reloading for [Sass](https://sass-lang.com/)
- Custom webpack manifest parsing + code minification
- CSS-in-JS (Emotion) in combination with custom Bootstrap build
- fast-async instead of regenerator
- Client is written in Typescript

## Dependencies

Static assets are loaded from LWJGL's CDN ( AWS CloudFront ).

<!-- We use [Google Analytics](http://www.google.com/analytics) for tracking. -->

Build status icons are loaded directly from travis-ci.org and appveyor.com.

Other LWJGL subdomains:

- The website for LWJGL 2 can be found [here](https://github.com/LWJGL/lwjgl-www). A static copy of the old LWJGL website is now hosted directly from S3
- The blog is powered by [Ghost](https://ghost.org/).
- The forum is [SMF](http://www.simplemachines.org/).
- The wiki for LWJGL 2 was [MediaWiki](https://www.mediawiki.org/). A static copy of the old LWJGL wiki is now hosted directly from S3.

## Production Requirements

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [PM2](https://github.com/Unitech/pm2) or [forever](https://github.com/foreverjs/forever)

## Development Prerequisites

- [Yarn](https://yarnpkg.com/en/)
- [Nodemon](https://nodemon.io/)

## Development

### Build/running in development

1.  To install all required npm packages:

```bash
yarn
```

2.  To start the server in dev mode:

```bash
node server
# or
yarn start
```

_OPTIONAL_: Monitor for /server changes & auto-restart with:

```bash
yarn watch
```

### CLI flags

```bash
--css # Enables CSS modules in dev mode (enables Sass HMR)
--sourcemap # Enables inline JS source-maps
--nohmr # Disables Webpack Hot Module Replacement
```

The following flags are used for testing production builds locally.
NODE_ENV environment variable must be set to "production".

```bash
--test # Enables production test mode (loads assets from disk instead of S3)
--nocache # Disables Pug view caching
--pretty # Pretty prints HTML
--s3proxy # Proxies S3 images
```

The following flags are used for testing production builds locally.
NODE_ENV environment variable must be set to "production".

```bash
--test # Enables production test mode (loads assets from disk instead of S3)
--nocache # Disables Pug view caching
--pretty # Pretty prints HTML
--s3proxy # Proxies S3 images
```

Flag usage examples:

```bash
node server --css
node server --async --nohmr
yarn watch -- --async --nohmr
```

### Configuration file (_OPTIONAL_)

Default config if file is missing:

```json
{
  "port": 80,
  "host": "0.0.0.0"
}
```

### Environment variables

NODE_ENV=production (default=development)
PORT=8088 (default=80)
HOST=127.0.0.1 (default=0.0.0.0)

## Production

The website is served via Amazon CloudFront using the server's hostname & port as origin.
SSL Termination happens on the CDN (using a certificate issued by AWS Certificate Manager).

The production process involves the following steps:

- Compile SCSS files (_node-sass -> postcss -> autoprefixer -> cssnano_)
- Compile JS files with webpack (_babel_) and store the manifest on disk
- Process the manifest:
  - Read the webpack manifest and compile list of files & routes
  - Process each file with terser
  - Compute hashes of final files
  - Store each production file on disk
  - Generate production manifest that also needs to be shipped
  - Generate & print file size report
- Deploy files to S3
- Start or reload node app

### Build for production

```bash
git pull
yarn
yarn release
```

To run the production build (\*nix only)

```bash
NODE_ENV=production node server
```

you can simulate and run the production build locally:

```bash
# will use production assets on disk
yarn test-production
# will download production assets from S3, only proxies request that pass through Cloudfront
yarn run-production
```

To test the production build with [React DevTools Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) enabled:

```bash
yarn production-profiling
yarn post-production
yarn test-production
```

### Debugging production output

The following debugging tips may come in handy:

- Disable minification by uncommenting `minimize: false` in `webpack.config.js`
- Prevent Terser from dropping `console.log` or `debugger` by changing `terserOptions` in `webpack.config.js`
- Pass `--profiling` to load React profiling builds
- Output `named` module & chunk ids in `webpack.config.js`
- Analyze build output with `npx webpack-bundle-analyzer public/js/webpack.manifest.json -h 0.0.0.0` (for full breakdown, change to `all: true` when writing `webpack.manifest.json` in `build-production.js`)

### Run in production with PM2

```bash
cd /path/to/lwjgl3-www
NODE_ENV=production pm2 start server/index.js --name lwjgl
pm2 save
```

or place a process.json file anywhere with the following contents:

```json
{
  "apps": [
    {
      "name": "lwjgl-site",
      "cwd": "/path/to/lwjgl3-www",
      "script": "./server/index.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 7687
      }
    }
  ]
}
```

and then run:

```bash
pm2 start process.json --only lwjgl-site
pm2 save
```

## Docker

To build the production docker image:

```bash
docker build --rm -t lwjgl/website:latest .
```

To test the production docker image (after running release):

```bash
docker-compose up
```

In order to access AWS resources in development, you'll need to create
a `docker-compose.override.yml` file and populate it with the following configuration:

```yml
version: '3.7'

services:
  lwjgl:
    environment:
      - AWS_ACCESS_KEY_ID=XXXXX
      - AWS_SECRET_ACCESS_KEY=XXXXX
```

To push the image to Docker Hub (requires access to LWJGL organization):

```bash
docker push lwjgl/website:latest
```

## IDE Setup

We recommend [Visual Studio Code](https://code.visualstudio.com/) with the following plugins:

- Prettier - Code formatter
- vscode-styled-components
- IntelliSense for CSS class names

We also recommend enabling auto-save onWindowChange for faster HMR (simply Alt/Cmd+Tab).
In VS Code add the following in the user settings:

```json
{
  "files.autoSave": "onWindowChange"
}
```

Recommended VS Code **Workspace Settings**:

- enable Prettier's format-on-save
- exclude generated files

```json
{
  "editor.formatOnSave": true,
  "files.exclude": {
    "**/.vscode": true,
    "**/public/js/*": true,
    "**/public/css/*": true
  },
  "typescript.tsdk": "node_modules\\typescript\\lib",
  "html-css-class-completion.includeGlobPattern": "**/*.{css}"
}
```
