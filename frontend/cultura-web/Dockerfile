# =========================
# ETAPA 1: BUILD ANGULAR
# =========================
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# =========================
# ETAPA 2: NGINX
# =========================
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY nginx-ssl.conf /etc/nginx/conf.d/sigpac-ssl.conf.disabled

COPY --from=builder /app/dist/cultura-web/browser /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
