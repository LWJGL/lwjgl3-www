FROM node:slim@sha256:7b2d32de2a02e13e67ae58114cf0095b81c6bb33ee0ce0e6368800b7c36178e3 AS build
WORKDIR /srv
COPY package.json package-lock.json .npmrc ./
RUN npm ci --prod --no-audit --no-fund

FROM node:slim@sha256:7b2d32de2a02e13e67ae58114cf0095b81c6bb33ee0ce0e6368800b7c36178e3
ENV NODE_ENV production
WORKDIR /srv
COPY --from=build /srv/node_modules ./node_modules
COPY package.json .
COPY server ./server
COPY public ./public

EXPOSE 80
CMD ["node", "--max_old_space_size=512", "server/index.mjs"]
