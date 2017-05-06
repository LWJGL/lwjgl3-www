# [LWJGL.org](https://www.lwjgl.org) - The home of Lightweight Java Game Library 3

The website for LWJGL 3.

## Production Requirements

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [PM2](https://github.com/Unitech/pm2) or [forever](https://github.com/foreverjs/forever)

## Development Prerequisites

- **Yarn**
- **Nodemon**

```bash
npm -g i nodemon yarn
```

## Dependencies

Static assets are loaded from LWJGL's CDN ( AWS CloudFront ).

We use [Google Analytics](http://www.google.com/analytics) for tracking.

Build status icons are loaded directly from travis-ci.org.

Other LWJGL subdomains:

- The website for LWJGL 2 can be found [here](https://github.com/LWJGL/lwjgl-www).
A static copy of the old LWJGL website is now hosted directly from S3
- The blog is [Ghost](https://ghost.org/).
- The forum is [SMF](http://www.simplemachines.org/).
- The wiki for LWJGL 2 was [MediaWiki](https://www.mediawiki.org/).
A static copy of the old LWJGL wiki is now hosted directly from S3.

## App Configuration

Place a JSON file in the root directory named config.json with the following contents.
Additional settings are automatically populated when the project is built for production.

```json
{
  "port": 8080,
  "hostname": "www.lwjgl.org",
  "analytics_tracking_id": "UA-XXXXXXX-X",
}
```

## Development

### Build/running in development

1. To install all required npm packages:

```bash
yarn
```

2. To build vendor JS file run:

```bash
yarn vendor
```

3. To start the server in dev mode:

```bash
yarn start
# or
node server
```

For watching and auto-reloading the server we use [nodemon](http://nodemon.io/).

Monitor for /server changes and auto-restart with:

```bash
yarn watch
```

### CLI flags

--nohmr => Disables Hot Module Reloading
--async => Enables async routes
--nocache => Disables Pug view caching *(for testing production)*
--pretty => Pretty prints HTML *(for testing production)*
--s3proxy => Proxies S3 images *(for testing production)*

Flag usage example:

```bash
node server --async
node server --async --nohmr
yarn watch -- --async --nohmr
```

## Production

The website is served via Amazon CloudFront using the server's hostname & port as origin.
SSL Termination happens on the CDN (using a certificate issued by AWS Certificate Manager).

### Build for production

```bash
git pull
yarn
yarn release
```

To run the production build ( in *nix )

```bash
NODE_ENV=production node server
```

or force production with (not recommended)

```bash
node server --production
```

### Run in production with PM2

```bash
cd /path/to/lwjgl3-www
NODE_ENV=production pm2 start server/index.js --name lwjgl
pm2 save
```

or place a process.json file anywhere with the following contents:

```js
{
  apps: [
    {
      name: "lwjgl-site",
      cwd: "/path/to/lwjgl3-www",
      script: "./server/index.js",
      env: {
        "NODE_ENV": "production",
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

Place a JSON file named forever.json in the root folder with the
following contents:

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
