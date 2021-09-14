FROM node:slim@sha256:af6f241029c4d63107c6ccbbd030c44d331786d724bd9c2e615edf46deab58e2 AS build
WORKDIR /srv
COPY package.json package-lock.json .npmrc ./
RUN npm ci --prod --no-audit --no-fund

FROM node:slim@sha256:af6f241029c4d63107c6ccbbd030c44d331786d724bd9c2e615edf46deab58e2
ENV NODE_ENV production
WORKDIR /srv
COPY --from=build /srv/node_modules ./node_modules
COPY package.json .
COPY server ./server
COPY public ./public

EXPOSE 80
CMD ["node", "--max_old_space_size=512", "server/index.mjs"]
