FROM node:slim AS build
ENV NODE_ENV="production"
ENV CI="true"
WORKDIR /srv
COPY package.json pnpm-lock.yaml .npmrc ./
RUN npm -g i corepack --force
RUN corepack enable
RUN pnpm i

FROM node:slim
ENV NODE_ENV="production"
WORKDIR /srv
COPY --from=build /srv/node_modules ./node_modules
COPY package.json .
COPY server ./server
COPY public ./public

EXPOSE 80
CMD ["node", "--max_old_space_size=384", "--no-warnings", "server/index.mjs"]
