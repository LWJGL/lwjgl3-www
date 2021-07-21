FROM node:slim@sha256:610ade6f0702b7355a045d7df4e53f78fded0060c5e765f2d5267b1a613465e8 AS build
WORKDIR /srv
COPY package.json package-lock.json .npmrc ./
RUN npm ci --prod --no-audit --no-fund

FROM node:slim@sha256:610ade6f0702b7355a045d7df4e53f78fded0060c5e765f2d5267b1a613465e8
ENV NODE_ENV production
WORKDIR /srv
COPY --from=build /srv/node_modules ./node_modules
COPY package.json .
COPY server ./server
COPY public ./public

EXPOSE 80
CMD ["node", "--max_old_space_size=512", "server/index.mjs"]
