# Backend Docker setup

`backend/Dockerfile` generates Prisma clients, compiles the API, and creates a production image listening on port `3001`. Prisma generation writes both the backend client and generated frontend model/types from `backend/prisma/schema.prisma`.

## Build requirements

Docker BuildKit is required. During the build, Prisma needs a datasource URL to generate the client, so the Dockerfile reads a `DATABASE_URL` BuildKit secret. A dummy PostgreSQL URL is sufficient because generation does not connect to the database. The production runtime still needs its real database URL and other environment configuration.

From the repository root, in PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/dummy?schema=public"
docker build --secret id=DATABASE_URL,env=DATABASE_URL -t real-estate-backend:latest ./backend
```

After changing the Prisma schema, regenerate from `backend/` with `npm run prisma:gen`; include the generated frontend client changes as well.

## Compose and runtime

Compose expects `real-estate-backend:${IMAGE_TAG:-latest}` to exist; the backend build block in root `compose.yaml` is commented out. CI/CD builds and publishes the application images. When building locally through Compose, enable the backend build block, set the dummy build `DATABASE_URL` in the host environment, and use BuildKit.

Compose reads runtime settings from `backend/.env`. Set a real `DATABASE_URL` there that the container can reach. Compose does not start PostgreSQL. The backend listens on `3001`, available to other Compose services at `http://backend:3001`; it is not published to the host by default. Browser API requests go through Nginx at `http://localhost/api` in local deployments.

For a standalone container, publish port `3001` and supply runtime configuration with an environment file. Ensure `PORT=3001` is set in that file because the application otherwise defaults to port `3000`:

```sh
docker run --rm --env-file backend/.env -p 3001:3001 real-estate-backend:latest
```

See the [root README](../README.md) for the full Compose topology and the [backend guide](README.md) for local development and migration commands.

