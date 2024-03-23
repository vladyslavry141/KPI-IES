FROM node:20-alpine
# Set the working directory in the container
WORKDIR /app
# Copy data
COPY . .
# Install app dependencies using PNPM
RUN npm install -g pnpm
# Install dependencies
RUN pnpm i --frozen-lockfile
RUN pnpm build:prod

FROM node:20-alpine
# Set the working directory in the container
# Copy package.json and pnpm-lock.yaml
COPY --from=0 app/pnpm-lock.yaml app/package.json app/

COPY --from=0 app/data app/data
COPY --from=0 app/dist app/dist
# Set the working directory in the container
WORKDIR /app

# Install app dependencies using PNPM
RUN npm install -g pnpm
# Install dependencies
RUN pnpm i --frozen-lockfile --prod

# Start the application
CMD ["pnpm", "run:prod"]

