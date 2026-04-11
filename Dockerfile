FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY public ./public
COPY src ./src
COPY index.html metadata.json tsconfig.json vite.config.ts ./

RUN npm run build

FROM caddy:2.8-alpine

WORKDIR /srv

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80
