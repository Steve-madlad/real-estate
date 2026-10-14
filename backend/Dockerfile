FROM node:22.23-alpine3.23 AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL \
npx prisma generate

RUN npm run build

FROM node:22.23-alpine3.23 AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json .
COPY --from=builder /app/dist ./dist

RUN npm ci --omit-dev

EXPOSE 3001

CMD [ "npm", "start" ]