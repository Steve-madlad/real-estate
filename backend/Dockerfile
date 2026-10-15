ARG NODE_VERSION=22.23

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN apk add --no-cache curl \
    && mkdir -p /app/certs \
    && curl -fsSL https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
       -o /app/certs/global-bundle.pem \
    && apk del curl
RUN --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL \
npx prisma generate

RUN npm run build

FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json .
COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev --omit=peer \
    && npm cache clean --force
    
EXPOSE 3001

CMD [ "npm", "start" ]