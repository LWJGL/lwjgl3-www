## [LWJGL.org](https://www.lwjgl.org) - The home of Lightweight Java Game Library 3

The website for LWJGL 3.

### Known Issues

- react-transform-hmr is deprecated. Use [React Hot Loader 3](https://github.com/gaearon/react-hot-loader) instead
- We should probably support Node.js LTS ( currently v4.x, requires additional babel plugins ) 
- Document Let's Encrypt certificate issuing/update process 

### Production Requirements

- [NGINX](http://nginx.org/)
- [Node.js & NPM](https://nodejs.org/en/)
- [PM2](https://github.com/Unitech/pm2) or [forever](https://github.com/foreverjs/forever)
- [Let's Encrypt CLI](https://letsencrypt.org/)

### Dependencies

Static assets are loaded from LWJGL's CDN.

SVG's are served from NGINX and gzip'd on the fly.

We use [Google Analytics](http://www.google.com/analytics) for tracking.

Build status icons are loaded directly from travis-ci.org.

A username account to LWJGL's TeamCity server is required for loading Windows build statuses.
Node proxies requests to (http://teamcity.lwjgl.org) to avoid SSL issues.

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
    "port": Integer
  },
  "teamcity": {
    "username": String,
    "password": String
  }
}
```

### Development Environment

For watching and auto-reloading the server we use [nodemon](http://nodemon.io/).

```bash
npm -g i nodemon
```

For react-transform-hmr to work the following configuration needs to be added inside the NGINX's server section:

```Nginx
location = /__webpack_hmr {
  proxy_pass http://127.0.0.1:7687;
  proxy_set_header Connection '';
  proxy_http_version 1.1;
  chunked_transfer_encoding off;
  proxy_buffering off;
  proxy_cache off;
}
```

A minimal NGINX configuration for development can look like this:

```Nginx
server {
  listen 80;
  server_name
    www.lwjgl.org
    dev.lwjgl.org
    www.lwjgl.dev
    www.lwjgl.local;

  location = /__webpack_hmr {
    proxy_pass http://127.0.0.1:7687;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding off;
    proxy_buffering off;
    proxy_cache off;
  }

  location / {
    proxy_buffering off;
    proxy_redirect off;
    proxy_intercept_errors off;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://127.0.0.1:7687;
  }
}
```

For avoiding issues with Strict-Transport-Security add the following rules in your host file or your proxy ( e.g. Fiddler )
and use any of the following host names to test locally:

```
127.0.0.1 dev.lwjgl.org
127.0.0.1 www.lwjgl.dev
127.0.0.1 www.lwjgl.local
```

### Build/running in development

```bash
npm i
npm styles
npm start
```

Instead of just starting the server, we can monitor for changes and auto-restart with nodemon:

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

Below you will find our current server configuration. Some rewrites ensure we don't break links for the old site.

```Nginx
server {
  listen 80;
  server_name
    lwjgl.org
    www.lwjgl.org
    lwjgl.com
    www.lwjgl.com;

  location ~ ^/\.well-known\/acme-challenge/ {
    root /srv/acme-challenge;
    try_files $uri /$1;
  }

  location /webstart/ {
    rewrite ^/(.*)$ http://legacy.lwjgl.org/$1 redirect;
  }

  location = /projects.php {
    rewrite ^/(.*)$ http://legacy.lwjgl.org/$1 redirect;
  }

  location / {
    return 301 https://www.lwjgl.org$request_uri;
  }
}

server {
  listen 443 ssl http2;
  server_name lwjgl.org;

  ssl_certificate /etc/letsencrypt/live/www.lwjgl.org/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/www.lwjgl.org/privkey.pem;
  ssl_trusted_certificate /etc/letsencrypt/live/www.lwjgl.org/fullchain.pem;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_stapling on;
  ssl_stapling_verify on;

  add_header Strict-Transport-Security "max-age=31536000; preload";

  return 301 https://www.lwjgl.org$request_uri;
}

server {
  listen 443 ssl http2;
  server_name www.lwjgl.org;

  ssl_certificate /etc/letsencrypt/live/www.lwjgl.org/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/www.lwjgl.org/privkey.pem;
  ssl_trusted_certificate /etc/letsencrypt/live/www.lwjgl.org/fullchain.pem;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_stapling on;
  ssl_stapling_verify on;

  add_header Strict-Transport-Security "max-age=31536000; preload";

  location = /wiki {
    return 301 http://wiki.lwjgl.org/;
  }

  location ^~ /wiki/ {
    rewrite
      ^/wiki/(.*)
      http://wiki.lwjgl.org/$1
      permanent;
  }

  location = /forum {
    return 301 http://forum.lwjgl.org/;
  }

  location ^~ /forum/ {
    rewrite
      ^/forum/(.*)
      http://forum.lwjgl.org/$1
      permanent;
  }

  location = /projects.php {
    rewrite ^/(.*)$ http://legacy.lwjgl.org/$1 permanent;
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
cd /path/to/lwjgl3-www/server
NODE_ENV=production pm2 start index.js --name lwjgl
pm2 save
```

### Run in production with forever

Place a JSON file named forever.json in the root folder with the following contents:

```json
{
    "uid": "lwjgl",
    "append": true,
    "watch": false,
    "script": "index.js",
    "sourceDir": "/path/to/lwjgl3-www/server",
    "args": ["--production"],
    "command": "node"
}
```

and then run:

```bash
forever start forever.json
```
