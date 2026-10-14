# Frontend Docker setup

The frontend has two Dockerfiles for the two Next.js production image
approaches:

- `frontend/Dockerfile` runs the regular Next.js production build with
  `npm start` and production `node_modules`. Its build-stage environment values
  are configured in that Dockerfile.
- `frontend/Dockerfile.standalone` runs Next.js's standalone output using its
  generated `server.js` and includes only the standalone server files, static
  assets, and public assets. It accepts the `NEXT_PUBLIC_*` build arguments
  documented below.

The current `frontend/next.config.ts` sets `output: 'standalone'`. Both
Dockerfiles run the same `npm run build`; the standalone Dockerfile packages the
standalone output, while the regular Dockerfile packages the normal `.next`
build and production dependencies. If changing the Next.js output setting,
choose a Dockerfile whose packaging and start command match that output.

## Run with Docker Compose

From the repository root:

```sh
docker compose up --build
```

Compose builds the frontend with `Dockerfile.standalone` and serves it at
<http://localhost:3000>. It also starts the backend service on port `3001`.
Compose's `depends_on` controls startup order only; it does not wait for the
backend to become healthy. The standalone Dockerfile accepts these build
arguments, which `compose.yaml` reads from the host environment:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_COGNITO_USER_POOL_ID`
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_APP_URL`

Set all five in your shell or `.env` file before running Compose. For PowerShell:

```powershell
$env:NEXT_PUBLIC_API_BASE_URL = "http://localhost:3001"
$env:NEXT_PUBLIC_COGNITO_USER_POOL_ID = "your-user-pool-id"
$env:NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = "your-user-pool-client-id"
$env:NEXT_PUBLIC_MAPBOX_TOKEN = "your-public-mapbox-token"
$env:NEXT_PUBLIC_APP_URL = "http://localhost:3000"
docker compose up --build
```

For bash or zsh, use `export NAME='value'` for each of the five variables
before running `docker compose up --build`. Compose interpolates these host
environment variables into the frontend build arguments; they are used during
`next build` and embedded in the client-side app. These `NEXT_PUBLIC_*` values
are public configuration, not secrets. Do not pass private credentials as
build arguments. If a variable is unset, Compose passes an empty value.
Changing a value requires rebuilding the frontend image.

To stop the services, run `docker compose down`. To use the configured file
watchers while developing, run `docker compose watch`; changes to source files
or Dockerfiles trigger rebuilds.

## Build and run either frontend image separately

Run these commands from the repository root. The last argument is the build
context and must remain `frontend`.

Regular Next.js production image:

```sh
docker build -f frontend/Dockerfile -t real-estate-frontend:default ./frontend
docker run --rm -p 3000:3000 real-estate-frontend:default
```

Standalone output image:

```sh
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
  --build-arg NEXT_PUBLIC_COGNITO_USER_POOL_ID="$NEXT_PUBLIC_COGNITO_USER_POOL_ID" \
  --build-arg NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID="$NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID" \
  --build-arg NEXT_PUBLIC_MAPBOX_TOKEN="$NEXT_PUBLIC_MAPBOX_TOKEN" \
  --build-arg NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL" \
  -f frontend/Dockerfile.standalone \
  -t real-estate-frontend:standalone ./frontend
docker run --rm -p 3000:3000 real-estate-frontend:standalone
```

The standalone build command uses bash/zsh variable syntax; in PowerShell pass
the values as `--build-arg NAME="$env:NAME"`. Both images listen on port `3000`.
Ensure `NEXT_PUBLIC_API_BASE_URL` points to an address reachable by the
browser. For local Compose use, `http://localhost:3001` is reachable from the
browser through the published backend port; `localhost` inside a container
refers to that container itself.
