# [LWJGL.org](https://www.lwjgl.org) - The home of Lightweight Java Game Library 3

The website for LWJGL 3 is build with React. It is a single-page application with client-side routing. It installs a Service Worker in order to work offline.

There is no server-side rendering because of hosting constraints.

Notable features:

- Client-side routing
- Service Worker (works offline)
- Tiny production build (entire codebase + content weights ~300KB gzipped)
- Code splitting at route & component level
- Scroll restoration
- Route preloading
- Proximity based route preloading (see /download page)
- Build Customizer with smart download queue & client-side ZIP generator
- Hot reloading using React Hot Loader
- Optional hot reloading for Sass
- Very fast dev builds using DllReferencePlugin
- Custom webpack manifest parsing + code minification
- Custom render-prop <Connect /> component for Redux
- CSS-in-JS (Emotion) in combination with custom Bootstrap build (Sass)
- fast-async instead of regenerator
- [Flow](https://flow.org/) static type checking

## Dependencies

Static assets are loaded from LWJGL's CDN ( AWS CloudFront ).

We use [Google Analytics](http://www.google.com/analytics) for tracking.

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

2.  To build vendor file(s) for development run:

```bash
yarn vendor
yarn styles --sourcemap
```

3.  To start the server in dev mode:

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
--react-perf # Enables react-perf-devtool in dev mode
--nohmr # Disables Webpack Hot Module Replacement & React Hot Loader
--redux-logger # Enables Logger for Redux
```

The following flags are used for testing production builds locally.
NODE_ENV environment variable must be set to "production".

```
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

### Environment variables

NODE_ENV=production (default=development)
PORT=8080 (default=80)

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
        "NODE_ENV": "production"
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

### Run in production with forever

Place a JSON file named forever.json in the root folder with the following contents:

```json
{
  "uid": "lwjgl",
  "append": true,
  "watch": false,
  "script": "server",
  "sourceDir": "/path/to/lwjgl3-www",
  "args": ["--production"],
  "command": "node"
}
```

and then run:

```bash
forever start forever.json
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

In order to access AWS resources, you'll need to create a `docker-compose.override.yml` file
and populate it with the following configuration:

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

- Flow Language Support
- Prettier - Code formatter
- vscode-styled-components

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
- disable built-in JS support because we rely on Flow

```json
{
  "editor.formatOnSave": true,
  "files.exclude": {
    "**/.vscode": true,
    "**/.cache-loader": true,
    "**/public/js/*": true,
    "**/public/css/*": true
  },
  "javascript.format.enable": false,
  "javascript.nameSuggestions": false,
  "javascript.referencesCodeLens.enabled": false,
  "javascript.validate.enable": false
}
```
