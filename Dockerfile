FROM node:slim AS build
WORKDIR /srv
COPY package.json package-lock.json .npmrc ./
RUN npm ci --omit=dev --force --no-audit --no-fund

FROM node:slim
ENV NODE_ENV production
WORKDIR /srv
COPY --from=build /srv/node_modules ./node_modules
COPY package.json .
COPY server ./server
COPY public ./public

EXPOSE 80
CMD ["node", "--max_old_space_size=384", "--no-warnings", "server/index.mjs"]
