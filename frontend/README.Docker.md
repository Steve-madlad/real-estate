# Frontend Docker setup

`Dockerfile.standalone` is the Compose frontend image and matches `output: 'standalone'` in `next.config.ts`. `Dockerfile` packages a regular Next.js production build and is an alternate image. Both builds need these public values at build time:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_COGNITO_USER_POOL_ID`
- `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

The values are embedded in the client bundle. They are public configuration, not secrets; changing any value requires rebuilding the image. The API URL must be reachable by the browser. Through the local Nginx service, use `http://localhost/api`.

## Compose

The frontend build block in root `compose.yaml` is commented out. By default Compose expects `real-estate-frontend:${IMAGE_TAG:-latest}` to exist already. CI/CD builds and publishes the application images. Nginx publishes the app on port `80`; the frontend's port `3000` is internal to the Compose network.

To build locally, uncomment the frontend build block in `compose.yaml` and provide the four variables above either in the host environment or in an env file. For example, create `frontend/.env.docker` with the four `NEXT_PUBLIC_*` assignments, then run this from the repository root:

```sh
docker compose --env-file frontend/.env.docker build frontend
```

`docker compose --env-file` loads values for Compose interpolation, which supplies the frontend build arguments declared in `compose.yaml`. Then start the stack with `docker compose up -d`. Alternatively, run a standalone build from the repository root:

```sh
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
  --build-arg NEXT_PUBLIC_COGNITO_USER_POOL_ID="$NEXT_PUBLIC_COGNITO_USER_POOL_ID" \
  --build-arg NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID="$NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID" \
  --build-arg NEXT_PUBLIC_MAPBOX_TOKEN="$NEXT_PUBLIC_MAPBOX_TOKEN" \
  -f frontend/Dockerfile.standalone \
  -t real-estate-frontend:latest ./frontend
```

In PowerShell, use `--build-arg NAME="$env:NAME"` for each value. See the [root README](../README.md) for the deployment topology and the [frontend guide](README.md) for local development and Prisma types.
