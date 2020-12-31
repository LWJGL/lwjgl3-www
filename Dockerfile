FROM node:alpine AS build
WORKDIR /srv
COPY package.json package-lock.json .npmrc ./
RUN npm i --prod --no-audit --no-fund

FROM node:alpine
ENV NODE_ENV production
WORKDIR /srv
COPY package.json .
COPY server ./server
COPY public ./public
COPY --from=build /srv/node_modules ./node_modules
RUN apk add --no-cache curl
RUN curl --silent https://s3.amazonaws.com/cdn.lwjgl.org/js/sw.js -o /srv/public/sw.js
RUN curl --silent https://s3.amazonaws.com/cdn.lwjgl.org/js/manifest.json -o /srv/public/manifest.json
RUN curl --silent https://s3.amazonaws.com/cdn.lwjgl.org/css/global.min.css -o /srv/public/global.min.css

EXPOSE 80
CMD ["node", "--max_old_space_size=512", "server/index.mjs"]
