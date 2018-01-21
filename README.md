# [LWJGL.org](https://www.lwjgl.org) - The home of Lightweight Java Game Library 3

The website for LWJGL 3 is build with React. It is a single-page application with client-side routing. It installs a Service Worker in order to work offline.

There is no server-side rendering because of hosting constraints.

Notable features:

* Client-side routing
* Service Worker (works offline)
* Tiny production build (entire codebase + content weights ~300KB gzipped)
* Code splitting at route & component level
* Scroll restoration
* Route preloading
* Proximity based route preloading (see /download page)
* Build Customizer with smart download queue & client-side ZIP generator
* Hot reloading using React Hot Loader
* Optional hot reloading for SASS
* Very fast dev builds using DllReferencePlugin
* Custom webpack manifest parsing + code minification
* Custom render-prop <Connect /> component for Redux
* CSS-in-JS (Emotion) in combination with custom Bootstrap build (SASS)
* fast-async instead of regenerator

## Dependencies

Static assets are loaded from LWJGL's CDN ( AWS CloudFront ).

We use [Google Analytics](http://www.google.com/analytics) for tracking.

Build status icons are loaded directly from travis-ci.org and appveyor.com.

Other LWJGL subdomains:

* The website for LWJGL 2 can be found [here](https://github.com/LWJGL/lwjgl-www). A static copy of the old LWJGL website is now hosted directly from S3
* The blog is [Ghost](https://ghost.org/).
* The forum is [SMF](http://www.simplemachines.org/).
* The wiki for LWJGL 2 was [MediaWiki](https://www.mediawiki.org/). A static copy of the old LWJGL wiki is now hosted directly from S3.

## Production Requirements

* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [PM2](https://github.com/Unitech/pm2) or [forever](https://github.com/foreverjs/forever)

## Development Prerequisites

* **Yarn**
* **Nodemon**

```bash
npm -g i nodemon yarn
```

## App Configuration

Place a JSON file in the root directory named config.json with the following contents.
Additional settings are automatically populated when the project is built for production.

```json
{
  "port": 8080,
  "hostname": "www.lwjgl.org",
  "analytics_tracking_id": "UA-XXXXXXX-X",
  "aws": {
    "accessKeyId": "",
    "secretAccessKey": "",
    "region": "us-east-1"
  }
}
```

AWS credentials are only needed for deploying compiled files to S3 (@see yarn deploy)

## Development

### Build/running in development

1. To install all required npm packages:

```bash
yarn
```

2. To build vendor file(s) for development run:

```bash
yarn vendor
yarn styles
```

3. To start the server in dev mode:

```bash
node server
# or
yarn start
```

For watching and auto-reloading the server we use [nodemon](http://nodemon.io/).

Monitor for /server changes and auto-restart with:

```bash
yarn watch
```

### CLI flags

--nohmr => Disables Hot Module Reloading (HMR)
--async => Enables async routes
--nocache => Disables Pug view caching _(for testing production)_
--pretty => Pretty prints HTML _(for testing production)_
--s3proxy => Proxies S3 images _(for testing production)_
--css => Enables CSS modules in development mode _(for SCSS HMR)_
--sourcemap => Enables inline source-maps
--react-perf => Enables react-perf-devtool in dev mode

Flag usage example:

```bash
node server --css
node server --async --nohmr
yarn watch -- --async --nohmr
```

## Production

The website is served via Amazon CloudFront using the server's hostname & port as origin.
SSL Termination happens on the CDN (using a certificate issued by AWS Certificate Manager).

The production process involves the following steps:

* Compile core SCSS files with webpack (_sass-loader -> postcss-loader -> css-loader -> ExtractTextPlugin_)
* Compile JS files with webpack (_babel_) and store the manifest on disk
* Process the manifest:
  * Read the webpack manifest and compile list of files & routes
  * Process each file with uglify-js
  * Compute hashes of final files
  * Store each production file on disk
  * Generate production manifest that also needs to be shipped
  * Generate & print file size report

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

## IDE Setup

We recommend [Visual Studio Code](https://code.visualstudio.com/) with the following plugins:

* flow-for-vscode
* Prettier

Other useful plugins:

* npm Intellisense
* SCSS IntelliSense

We also recommend enabling auto-save onWindowChange for faster HMR (simply Alt/Cmd+Tab).
In VS Code add the following in the user settings:

```json
{
  "files.autoSave": "onWindowChange"
}
```

Recommended VS Code **Workspace Settings**:

```json
{
  "editor.formatOnSave": true,
  "files.exclude": {
    "**/.vscode": true,
    "**/.history": true,
    "**/.cache-loader": true,
    "**/public/js/*.js*": true,
    "**/public/css/*.css*": true
  },
  "files.associations": {
    "*.mjs": "javascript",
    "**/client/**/*.jsx": "javascriptreact"
  },
  "javascript.format.enable": false,
  "javascript.nameSuggestions": false,
  "javascript.referencesCodeLens.enabled": false,
  "javascript.validate.enable": false
}
```
