## [LWJGL.org](https://www.lwjgl.org) - The home of Lightweight Java Game Library 3

The website for LWJGL 3.

### Production Requirements

- [NGINX](http://nginx.org/)
- [Node.js & NPM](https://nodejs.org/en/)
- [PM2](https://github.com/Unitech/pm2)
- [Let's Encrypt CLI](https://letsencrypt.org/)

### Dependencies

Static assets are loaded from LWJGL's CDN.

Some libraries/files are loaded from other servers:

- [highlight.js](https://highlightjs.org/)
- [Google Analytics](http://www.google.com/analytics)

Build status icons are loaded from travis-ci.org and TeamCity.

The blog is [Ghost](https://ghost.org/), the forum is [SMF](http://www.simplemachines.org/), the old website can be found [here](https://github.com/LWJGL/lwjgl-www), and the old wiki is [MediaWiki](https://www.mediawiki.org/).

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

  location = /externalStatus.html {
    proxy_buffering off;
    proxy_redirect off;
    proxy_intercept_errors off;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host teamcity.lwjgl.org;
    proxy_pass http://teamcity.lwjgl.org;
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

### Development Environment

For watching and auto-reloading the server we use [nodemon](http://nodemon.io/). This is the only required
global NPM package. Install with:

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
    lwjgl.org
    lwjgl.dev
    lwjgl.local;
  return 301 $scheme://www.lwjgl.local$request_uri;
}

server {
  listen 80;
  server_name
    dev.lwjgl.org
    www.lwjgl.org
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

  location = /externalStatus.html {
    proxy_buffering off;
    proxy_redirect off;
    proxy_intercept_errors off;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host teamcity.lwjgl.org;
    proxy_pass http://teamcity.lwjgl.org;
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

Instead of just starting the server, we can monitor for changes with nodemon:

```bash
npm run watch
```

Styles can be monitored for changes and automatically re-compiled with:

```bash
npm styles-watch
```

### Build/running in production

```bash
npm i
npm run production
```

Start with PM2

```
cd /path/to/lwjgl3-www/server
NODE_ENV=production pm2 start index.js --name lwjgl
pm2 save
```

Start with forever

```
cd /path/to/lwjgl3-www/server
forever start -a --uid lwjgl index.js
```

### Known Issues

- react-transform-hmr is deprecated. Use React Hot Reload 3
- Add support for Node.js LTS
