FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN npm install -g npm@11 && npm install --no-audit --no-fund

COPY . .
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-nginx-resolver.sh /docker-entrypoint.d/40-resolver.sh
RUN chmod +x /docker-entrypoint.d/40-resolver.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
