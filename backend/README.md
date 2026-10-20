# Backend

Express and TypeScript API for Rentiful. The service listens on port `3001` and uses PostgreSQL through Prisma's PostgreSQL adapter.

## Local development

From `backend/`, install dependencies and configure a `.env` file with at least `DATABASE_URL`, `PORT`, Cognito settings, and AWS settings required by the features you use. See the source for the complete runtime configuration. The database URL must point to a PostgreSQL database with PostGIS available.

```sh
npm ci
npm run prisma:gen
npm run dev
```

`npm run build` compiles TypeScript to `dist/`; `npm start` runs the compiled API. Apply committed database migrations with `npm run prisma:mgt:dep`. The `npm run seed` script loads the development seed data.

## Prisma client generation

The Prisma schema is in `prisma/schema.prisma`. Its two generators write clients into the backend (`backend/prisma/generated`) and frontend (`frontend/prisma/generated/client`). After changing the schema, run `npm run prisma:gen` from `backend/` and commit the generated frontend client changes along with the schema when appropriate. The frontend imports these generated types directly, so keep schema and generated files in sync.

## Docker

`Dockerfile` generates Prisma clients and compiles the API in its build stage, then creates a production image listening on port `3001`. BuildKit is required because Prisma generation reads `DATABASE_URL` through a secret mount. It needs only a syntactically valid dummy PostgreSQL URL at build time; generation does not connect to the database.

From the repository root, for PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/dummy?schema=public"
docker build --secret id=DATABASE_URL,env=DATABASE_URL -t real-estate-backend ./backend
```

Pass the real runtime `DATABASE_URL` using the deployment environment or `backend/.env`. Do not put the dummy build URL in the runtime configuration. Compose reads `backend/.env`, expects the backend image `real-estate-backend:${IMAGE_TAG:-latest}` to exist, and does not start PostgreSQL.

See the root [README](../README.md) for the Compose topology and deployment notes.
