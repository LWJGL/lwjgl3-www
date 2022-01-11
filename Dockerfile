# docker images --no-trunc -q node:slim
FROM node:slim@sha256:a6a0d486ccb24e735ec3f03d2e338a064ad2bf4946e9cbac1e3f0a73e4a59dae AS build
WORKDIR /srv
COPY package.json package-lock.json .npmrc ./
RUN npm ci --prod --no-audit --no-fund

FROM node:slim@sha256:a6a0d486ccb24e735ec3f03d2e338a064ad2bf4946e9cbac1e3f0a73e4a59dae
ENV NODE_ENV production
WORKDIR /srv
COPY --from=build /srv/node_modules ./node_modules
COPY package.json .
COPY server ./server
COPY public ./public

EXPOSE 80
CMD ["node", "--max_old_space_size=512", "server/index.mjs"]
