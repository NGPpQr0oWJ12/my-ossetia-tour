#!/usr/bin/env bash
set -Eeuo pipefail

REPO_URL="${REPO_URL:-https://github.com/NGPpQr0oWJ12/my-ossetia-tour.git}"
BRANCH="${BRANCH:-main}"
APP_DIR="${APP_DIR:-$HOME/apps/my-ossetia-tour}"
TRAEFIK_NETWORK="${TRAEFIK_NETWORK:-edge}"
GIT_CMD=(git)
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

configure_git_auth() {
  if [ -n "${GITHUB_TOKEN:-}" ] && [[ "$REPO_URL" == https://github.com/* ]]; then
    GIT_CMD=(git -c "http.extraHeader=Authorization: Bearer ${GITHUB_TOKEN}")
    return
  fi

  GIT_CMD=(git)
}

run_git() {
  "${GIT_CMD[@]}" "$@"
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

  if [ -d "$APP_DIR/.git" ]; then
    log "Updating repository in $APP_DIR"
    run_git -C "$APP_DIR" fetch --prune origin
    run_git -C "$APP_DIR" checkout "$BRANCH"
    run_git -C "$APP_DIR" pull --ff-only origin "$BRANCH"
    return
  fi

  log "Cloning repository into $APP_DIR"
  run_git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
}

write_env() {
  local env_file email
  env_file="$APP_DIR/deploy/proxy/.env"
  email="$(prompt_email)"
  mkdir -p "$(dirname "$env_file")"

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
  configure_git_auth
  resolve_compose_cmd
  prepare_repo
  write_env
  install_proxy
}

main "$@"
