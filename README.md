## [LWJGL.org](https://www.lwjgl.org) - The home of Lightweight Java Game Library 3

The website for LWJGL 3.

### Production Requirements

- [NGINX](http://nginx.org/)
- [Node.js & NPM](https://nodejs.org/en/)
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
- The blog is [Ghost](https://ghost.org/).
- The forum is [SMF](http://www.simplemachines.org/).
- The wiki for LWJGL 2 is [MediaWiki](https://www.mediawiki.org/).

### App Configuration

Place a .js file in the root directory named config.js

```JavaScript
export default {
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

A minimal NGINX configuration for development ( w/ Hot Module Reloading )
can look like this:

```Nginx
server {
  listen 80;
  server_name
    www.lwjgl.org
    dev.lwjgl.org
    www.lwjgl.dev
    www.lwjgl.local;

  location = /__webpack_hmr {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding off;
    proxy_buffering off;
    proxy_cache off;
  }
  
  location /img {
    proxy_buffering off;
    proxy_redirect off;
    proxy_intercept_errors off;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host cdn.lwjgl.org.s3.amazonaws.com;
    proxy_pass http://cdn.lwjgl.org.s3.amazonaws.com;
    proxy_pass_request_body off;
  }

  location /svg {
    proxy_buffering off;
    proxy_redirect off;
    proxy_intercept_errors off;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host cdn.lwjgl.org.s3.amazonaws.com;
    proxy_pass http://cdn.lwjgl.org.s3.amazonaws.com;
    proxy_pass_request_body off;
  }

  location / {
    proxy_buffering off;
    proxy_redirect off;
    proxy_intercept_errors off;
    proxy_http_version 1.1;
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
127.0.0.1 www.lwjgl.dev
127.0.0.1 www.lwjgl.local
```

Alternatively a custom SSL certificate may be issued and installed on your
local NGINX.

### Build/running in development

```bash
npm i
npm styles
npm start
```

Instead of just starting the server, we can monitor for changes and
auto-restart with nodemon:

```bash
npm run watch
```

Styles can be monitored for changes and automatically re-compiled with:

```bash
npm styles-watch
```

# Production

### NGINX Configuration

Make sure you have [gzip compression](http://nginx.org/en/docs/http/ngx_http_gzip_module.html) enabled.

Below you will find our current server configuration. Some rewrites ensure
we don't break links for the old site.

```Nginx
server {
  listen 80;
  server_name
    lwjgl.org
    lwjgl.com
    www.lwjgl.com;

  return 301 https://www.lwjgl.org$request_uri;
}

server {
  listen 80;
  server_name www.lwjgl.org;

  add_header Strict-Transport-Security "max-age=31536000; preload";

  location = /projects.php {
    return 301 http://legacy.lwjgl.org/projects.php;
  }

  location = /license.php {
    return 301 /license;
  }

  location /webstart/ {
    rewrite ^/webstart/(.*)$ http://legacy.lwjgl.org/webstart/$1 redirect;
  }

  location = /wiki {
    return 301 http://wiki.lwjgl.org/;
  }

  location ^~ /wiki/ {
    rewrite ^/wiki/(.*) http://wiki.lwjgl.org/$1 permanent;
  }

  location = /forum {
    return 301 http://forum.lwjgl.org/;
  }

  location ^~ /forum/ {
    rewrite ^/forum/(.*) http://forum.lwjgl.org/$1 permanent;
  }

  location / {
    proxy_buffering off;
    proxy_redirect off;
    proxy_intercept_errors off;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://localhost:7687;
  }
}
```

### Build for production

```bash
npm i
npm run production
```

To run the production build

```bash
NODE_ENV=production node server
```

or

```bash
node server --production
```

### Run in production with PM2

```bash
cd /path/to/lwjgl3-www
NODE_ENV=production pm2 start server/index.js --name lwjgl
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
