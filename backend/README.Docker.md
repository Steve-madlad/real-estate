# Backend Docker setup

The backend image is built from `backend/Dockerfile` with `backend` as its build
context. It compiles the TypeScript application, generates the Prisma client,
and runs the production server on port `3001`.

## Requirements

- Docker with BuildKit enabled (the Dockerfile uses a BuildKit secret mount).
- A `backend/.env` file containing the backend's runtime environment variables.
  Compose reads this file on the host; it is not copied into the image.
- A temporary dummy `DATABASE_URL` set in the host environment when building.
  Prisma needs a datasource URL to generate its client, but generation does not
  connect to the database. Compose passes this value to the build as a BuildKit
  secret; it is not baked into the image. The actual runtime connection string
  belongs in `backend/.env`.

## Run with Docker Compose

From the repository root, set a temporary dummy `DATABASE_URL` in your shell.
For PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/dummy?schema=public"
docker compose up --build
```

For bash, zsh, or a similar shell:

```sh
export DATABASE_URL='postgresql://user:password@localhost:5432/dummy?schema=public'
docker compose up --build
```

The temporary value is only used by `prisma generate` during the image build;
it is not a real credential and is not used to connect to a database. Compose
passes it as a BuildKit secret. For runtime, the backend reads the actual
connection string from `backend/.env`. The Compose setup does not start a
database, so configure a database reachable from the backend container there.

To stop the services, run `docker compose down`. To use Compose's configured
file watchers while developing, run `docker compose watch`.

## Build and run the backend separately

From the repository root, set the temporary dummy `DATABASE_URL` in the host
environment, then build the image. For example, in PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/dummy?schema=public"
docker build --secret id=DATABASE_URL,env=DATABASE_URL -t real-estate-backend ./backend
```

In bash, zsh, or a similar shell, set
`export DATABASE_URL='postgresql://user:password@localhost:5432/dummy?schema=public'`
before running the `docker build` command.

Run it with the backend environment file:

```sh
docker run --rm --env-file backend/.env -p 3001:3001 real-estate-backend
```

## Ports and service connection

The backend listens on port `3001`. In Compose, the frontend and backend are
separate services. Browser requests to the frontend use the API URL configured
at frontend build time; backend-to-backend container requests should use the
Compose service hostname `backend-compose` and port `3001`, not `localhost`.
