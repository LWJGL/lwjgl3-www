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

EXPOSE 80
CMD ["node", "--max_old_space_size=512", "server/index.mjs"]
