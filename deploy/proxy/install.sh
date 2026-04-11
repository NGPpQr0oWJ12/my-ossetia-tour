#!/usr/bin/env bash
set -Eeuo pipefail

REPO_URL="${REPO_URL:-https://github.com/NGPpQr0oWJ12/my-ossetia-tour.git}"
BRANCH="${BRANCH:-main}"
APP_DIR="${APP_DIR:-$HOME/apps/my-ossetia-tour}"
TRAEFIK_NETWORK="${TRAEFIK_NETWORK:-edge}"
COMPOSE_CMD=()

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

fail() {
  printf '\n[error] %s\n' "$1" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Command '$1' is required."
}

resolve_compose_cmd() {
  if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD=(docker compose)
    return
  fi

  if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD=(docker-compose)
    return
  fi

  fail "Docker Compose is required."
}

prompt_email() {
  local email="${ACME_EMAIL:-}"

  while [ -z "$email" ]; do
    if [ -r /dev/tty ]; then
      read -r -p "Email for Let's Encrypt notifications: " email < /dev/tty
    else
      fail "Interactive input is unavailable. Re-run with ACME_EMAIL=admin@example.com."
    fi
  done

  printf '%s' "$email"
}

prepare_repo() {
  local parent_dir
  parent_dir="$(dirname "$APP_DIR")"
  mkdir -p "$parent_dir"

  if [ ! -d "$APP_DIR/.git" ]; then
    log "Cloning repository into $APP_DIR"
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  fi
}

write_env() {
  local env_file email
  env_file="$APP_DIR/deploy/proxy/.env"
  email="$(prompt_email)"

  cat > "$env_file" <<EOF
ACME_EMAIL=$email
TRAEFIK_NETWORK=$TRAEFIK_NETWORK
EOF
}

install_proxy() {
  cd "$APP_DIR"
  log "Starting shared Traefik proxy"
  "${COMPOSE_CMD[@]}" -f deploy/proxy/compose.yaml --env-file deploy/proxy/.env up -d
}

main() {
  require_cmd git
  require_cmd docker
  resolve_compose_cmd
  prepare_repo
  write_env
  install_proxy
}

main "$@"
