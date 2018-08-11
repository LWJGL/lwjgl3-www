# Node.js Alpine Linux (smallest image)
# Replace with node:latest for defacto image
FROM node:alpine AS build
WORKDIR /srv
COPY package.json yarn.lock ./
RUN yarn --prod

FROM node:alpine
ENV NODE_ENV production
WORKDIR /srv
COPY --from=build /srv/node_modules ./node_modules
COPY public ./public
COPY server ./server

EXPOSE 80
CMD ["node", "server"]
