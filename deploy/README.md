# Docker deployment

This project is prepared for isolated deployment in Docker with automatic HTTPS via Caddy.

## What the stack does

- builds the Vite app into static files
- serves it from a Docker container based on `caddy`
- requests and renews a free TLS certificate automatically
- keeps certificates in Docker volumes, without installing nginx or certbot on the host

## Server requirements

- Docker Engine
- Docker Compose plugin or `docker-compose`
- Git
- open ports `80` and `443`
- DNS `A` or `AAAA` record for your domain already pointing to the server

## First deployment

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | bash
```

The script will:

1. clone the repository to `$HOME/apps/my-ossetia-tour`
2. ask for the domain on the first run
3. save the domain in `deploy/.env.production`
4. build and start the Docker stack
5. let Caddy obtain the certificate automatically

## Optional parameters

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | APP_DIR=/srv/my-ossetia-tour BRANCH=main bash
```

Supported variables:

- `APP_DIR` - target directory on the server
- `BRANCH` - git branch to deploy
- `REPO_URL` - custom repository URL
- `FORCE_RECONFIGURE=1` - ask for the domain again even if it is already saved

## Updating an existing deployment

Run the same command again:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | bash
```

If `deploy/.env.production` already exists, the saved domain is reused.

## Manual operations

From the project directory on the server:

```bash
docker compose --env-file deploy/.env.production up -d --build
docker compose logs -f
docker compose down
```

## Important note

This stack binds host ports `80` and `443`. If another service already uses these ports, Docker will not start the site until the conflict is removed or you switch to a shared reverse proxy architecture.
