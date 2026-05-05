FROM docker.io/oven/bun:1-alpine AS build
WORKDIR /app
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM docker.io/oven/bun:1-alpine
RUN bun install -g serve
COPY --from=build /app/dist /app/dist
EXPOSE 80
CMD ["serve", "-s", "/app/dist", "-l", "80", "--no-clipboard"]
