## [LWJGL.org](https://www.lwjgl.org) - The home of Lightweight Java Game Library 3

The website for LWJGL 3.

### Production Requirements

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [PM2](https://github.com/Unitech/pm2) or [forever](https://github.com/foreverjs/forever)

### Dependencies

Static assets are loaded from LWJGL's CDN ( AWS CloudFront ).

We use [Google Analytics](http://www.google.com/analytics) for tracking.

Build status icons are loaded directly from travis-ci.org.

A username account to LWJGL's TeamCity server is required for loading
Windows build statuses. Node proxies requests to
[teamcity.lwjgl.org](http://teamcity.lwjgl.org) to avoid SSL issues.

Other LWJGL subdomains:

- The website for LWJGL 2 can be found [here](https://github.com/LWJGL/lwjgl-www).
A static copy of the old LWJGL website is now hosted directly from S3 
- The blog is [Ghost](https://ghost.org/).
- The forum is [SMF](http://www.simplemachines.org/).
- The wiki for LWJGL 2 was [MediaWiki](https://www.mediawiki.org/).
A static copy of the old LWJGL wiki is now hosted directly from S3.

### App Configuration

Place a JSON file in the root directory named config.json with the following contents.
Additional settings are automatically populated when the project is built for production.

```json
{
  "server": {
    "port": 8080
  },
  "teamcity": {
    "username": "<user>",
    "password": "<pass>"
  }
}
```

### Development Environment

For watching and auto-reloading the server we use [nodemon](http://nodemon.io/).

```bash
npm -g i nodemon
```

A minimal NGINX configuration for development can look like this:

```Nginx
server {
  listen 80;
  server_name dev.lwjgl.org;

  proxy_buffering off;
  proxy_redirect off;
  proxy_intercept_errors off;
  proxy_http_version 1.1;
  
  location /img {
    proxy_set_header Connection "";
    proxy_set_header Host cdn.lwjgl.org.s3.amazonaws.com;
    proxy_pass http://cdn.lwjgl.org.s3.amazonaws.com;
    proxy_pass_request_body off;
  }

  location /svg {
    proxy_set_header Connection "";
    proxy_set_header Host cdn.lwjgl.org.s3.amazonaws.com;
    proxy_pass http://cdn.lwjgl.org.s3.amazonaws.com;
    proxy_pass_request_body off;
  }

  location / {
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://127.0.0.1:8080;
  }
}
```

For avoiding issues with Strict-Transport-Security add the following
rules in your host file or your proxy ( e.g. Fiddler ) and use any of the
following host names to test locally:

```
127.0.0.1 dev.lwjgl.org
```

Alternatively a custom SSL certificate may be issued and installed on your
local NGINX.

### Build/running in development

To install all required npm packages:

```bash
yarn
```

To build external CSS files run:

```bash
npm run styles
```

To start the server in dev mode:

```bash
npm start
```

or

```bash
node server
```

Instead of just starting the server, we can monitor for changes and
auto-restart with nodemon:

```bash
npm run watch
```

# Production

### NGINX Configuration

NGINX is no longer required in production. We serve the website via Amazon CloudFront using
the server's hostname & port as origin.

### Build for production

```bash
yarn
npm run production
```

To run the production build ( in *nix )

```bash
NODE_ENV=production node server
```

or

```bash
node server --production
```

```bash
npm run start-production
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
