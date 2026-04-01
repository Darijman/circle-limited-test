# ---------- STAGE 1: BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

# зависимости
COPY ./frontend/package*.json ./
RUN npm ci

# копируем только frontend
COPY ./frontend ./

# билд
RUN npm run build


# ---------- STAGE 2: NGINX ----------
FROM nginx:stable-alpine

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]