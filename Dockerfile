FROM node:slim@sha256:0241181df2c9b398d2261331d1ad29f98cf965b155df5daa39d011b935457fb4 AS build
WORKDIR /srv
COPY package.json package-lock.json .npmrc ./
RUN npm ci --prod --no-audit --no-fund

FROM node:slim@sha256:0241181df2c9b398d2261331d1ad29f98cf965b155df5daa39d011b935457fb4
ENV NODE_ENV production
WORKDIR /srv
COPY --from=build /srv/node_modules ./node_modules
COPY package.json .
COPY server ./server
COPY public ./public

EXPOSE 80
CMD ["node", "--max_old_space_size=512", "server/index.mjs"]
