# Docker deployment

This repository now uses a shared reverse-proxy architecture.

## How it works

- a single Dockerized `Traefik` instance owns host ports `80` and `443`
- Traefik issues and renews Let's Encrypt certificates
- this app runs in its own container and joins the shared proxy network
- the app itself does not bind host ports

This is the correct setup when multiple applications must coexist on one server.

## Server-wide proxy

Install the shared proxy once per server:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/proxy/install.sh | ACME_EMAIL=admin@example.com bash
```

That creates the shared Docker network `edge` and starts Traefik with automatic Let's Encrypt.

If your server already has a reverse proxy, do not install another one. Instead, connect this app to the same proxy network and routing scheme.

## App deployment

Public repository:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | DOMAIN=example.com bash
```

Private repository:

```bash
export GITHUB_TOKEN=your_github_token
curl -fsSL \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.raw" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/NGPpQr0oWJ12/my-ossetia-tour/contents/deploy/install.sh?ref=main" | DOMAIN=example.com bash
```

## Variables

- `APP_DIR` - target directory on the server
- `BRANCH` - branch to deploy
- `REPO_URL` - custom repository URL
- `DOMAIN` - site domain
- `TRAEFIK_NETWORK` - external proxy network name, default `edge`
- `GITHUB_TOKEN` - token for private GitHub repository access
- `FORCE_RECONFIGURE=1` - ask for the domain again
- `ACME_EMAIL` - Let's Encrypt email for the shared proxy

## Manual commands

App:

```bash
docker compose --env-file deploy/.env.production up -d --build
docker compose logs -f
docker compose down
```

Proxy:

```bash
docker compose -f deploy/proxy/compose.yaml --env-file deploy/proxy/.env up -d
docker compose -f deploy/proxy/compose.yaml logs -f
```
