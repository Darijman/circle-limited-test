FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/prisma ./prisma

RUN npm ci --omit=dev

RUN npx prisma generate

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 9000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]