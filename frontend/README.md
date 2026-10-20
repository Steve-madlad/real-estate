# Frontend

Rentiful's Next.js App Router client. The app uses Next.js standalone output and serves on port `3000`.

## Local development

From `frontend/`, install dependencies, configure `.env.local`, then start Next.js:

```sh
npm ci
npm run dev
```

The `NEXT_PUBLIC_*` settings are public values bundled into the application during `next build`. Configure `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_COGNITO_USER_POOL_ID`, `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`, and `NEXT_PUBLIC_MAPBOX_TOKEN`. For a local browser, the API base URL is typically `http://localhost:3001/api`. These values must be supplied for production image builds too; changing them requires a new build. Never put private credentials in `NEXT_PUBLIC_*` values or Docker build arguments.

The app's public production URL is defined by `appPublicUrl` in [`lib/constants.ts`](lib/constants.ts); update that constant when the canonical URL changes.

## Prisma generated types

The frontend imports Prisma generated model types from `prisma/generated/client`. That client is generated from the backend schema by running `npm run prisma:gen` in `backend/`. When the schema changes, regenerate both clients and keep the generated frontend files synchronized with the schema.

## Docker

`Dockerfile.standalone` is the image used for Compose deployments. It builds the Next.js standalone output and requires the four public build values above. The alternate `Dockerfile` packages a regular Next.js production build; use it only when its output mode and start command match the Next.js config. See [README.Docker.md](README.Docker.md) for image build commands and [the root README](../README.md) for deployment topology.
