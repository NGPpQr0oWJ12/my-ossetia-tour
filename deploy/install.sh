#!/usr/bin/env bash
set -Eeuo pipefail

REPO_URL="${REPO_URL:-https://github.com/NGPpQr0oWJ12/my-ossetia-tour.git}"
BRANCH="${BRANCH:-main}"
APP_DIR="${APP_DIR:-$HOME/apps/my-ossetia-tour}"
GIT_CMD=(git)

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

clone_or_update_repo() {
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

  if [ -e "$APP_DIR" ]; then
    fail "Path '$APP_DIR' already exists and is not a git repository."
  fi

  log "Cloning repository into $APP_DIR"
  run_git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
}

normalize_domain() {
  local input="$1"
  input="${input#http://}"
  input="${input#https://}"
  input="${input%%/*}"
  input="${input%,}"
  printf '%s' "$input" | tr '[:upper:]' '[:lower:]'
}

prompt_domain() {
  local domain=""

  if [ -n "${DOMAIN:-}" ]; then
    domain="$(normalize_domain "$DOMAIN")"
  fi

  while [ -z "$domain" ]; do
    if [ -r /dev/tty ]; then
      read -r -p "Domain for the site (example.com): " domain < /dev/tty
      domain="$(normalize_domain "$domain")"
    else
      fail "Interactive input is unavailable. Re-run with DOMAIN=example.com."
    fi

    if [ -z "$domain" ]; then
      printf 'Domain cannot be empty.\n' > /dev/tty
    fi
  done

  printf '%s' "$domain"
}

ensure_domain_config() {
  local env_file current_domain domain
  env_file="$APP_DIR/deploy/.env.production"

  if [ -f "$env_file" ] && [ "${FORCE_RECONFIGURE:-0}" != "1" ]; then
    current_domain="$(grep '^DOMAIN=' "$env_file" | cut -d '=' -f 2- || true)"
    current_domain="$(normalize_domain "$current_domain")"

    if [ -n "$current_domain" ]; then
      log "Using saved domain: $current_domain"
      return
    fi
  fi

  log "Before issuing a certificate, point the domain A/AAAA record to this server and open ports 80/443."
  domain="$(prompt_domain)"

  cat > "$env_file" <<EOF
DOMAIN=$domain
EOF

  log "Saved domain configuration to $env_file"
}

deploy_stack() {
  cd "$APP_DIR"
  log "Building and starting the Docker stack"
  "${COMPOSE_CMD[@]}" --env-file deploy/.env.production up -d --build
}

print_summary() {
  local env_file domain
  env_file="$APP_DIR/deploy/.env.production"
  domain="$(grep '^DOMAIN=' "$env_file" | cut -d '=' -f 2- || true)"

  printf '\nDeployment finished.\n'
  printf 'Project directory: %s\n' "$APP_DIR"
  printf 'Domain: %s\n' "$domain"
  printf 'Site logs: cd %s && %s logs -f\n' "$APP_DIR" "${COMPOSE_CMD[*]}"
  printf 'Update later: curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/%s/deploy/install.sh | bash\n' "$BRANCH"
}

main() {
  require_cmd git
  require_cmd docker
  configure_git_auth
  resolve_compose_cmd
  clone_or_update_repo
  ensure_domain_config
  deploy_stack
  print_summary
}

main "$@"
