# syntax=docker/dockerfile:1

ARG NODE_VERSION=22
################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base


# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing all dependecies.
FROM base AS build

# Set build arguments for the environment variables that will be used in the build stage.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_COGNITO_USER_POOL_ID
ARG NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
ARG NEXT_PUBLIC_MAPBOX_TOKEN

# Set environment variables for the build stage.
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_COGNITO_USER_POOL_ID=$NEXT_PUBLIC_COGNITO_USER_POOL_ID \
    NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=$NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID \
    NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN

# Downloading additional development dependencies before building, AS TS needs to be compiled.
# Copy package.json and package-lock.json to the working directory.
COPY package*.json .
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the applicationdocker build -t real-estate-frontend . with minimal runtime dependencies
# where the necessary files are inherited from the build stage.
FROM build AS staging

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --legacy-peer-deps

################################################################################
# Create a stage for building the application.
FROM base AS final

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application AS a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=staging /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["npm", "start"]
