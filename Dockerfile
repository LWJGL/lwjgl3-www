# https://hub.docker.com/_/node?tab=tags
# node:slim (linux/amd64)
FROM node:slim@sha256:54fe711b2871e9497c1473f78d63538068f1b03ed1e5bc62501beb91492f4d6a AS build
WORKDIR /srv
COPY package.json package-lock.json .npmrc ./
RUN npm ci --prod --no-audit --no-fund

FROM node:slim@sha256:54fe711b2871e9497c1473f78d63538068f1b03ed1e5bc62501beb91492f4d6a
ENV NODE_ENV production
WORKDIR /srv
COPY --from=build /srv/node_modules ./node_modules
COPY package.json .
COPY server ./server
COPY public ./public

EXPOSE 80
CMD ["node", "--max_old_space_size=512", "server/index.mjs"]
