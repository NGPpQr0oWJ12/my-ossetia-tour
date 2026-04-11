# My Ossetia Tour

Сайт авторских туров по Северной Осетии на `React 19` + `TypeScript` + `Vite`.

## Стек

- `React 19`
- `TypeScript`
- `Vite 6`
- `Tailwind CSS v4`
- `motion`
- `react-router-dom`

## Локальная разработка

Требования:

- `Node.js 20+`
- `npm`

Запуск:

```bash
npm install
npm run dev
```

Проверка production-сборки:

```bash
npm run build
npm run lint
```

## Docker-деплой

Проект теперь рассчитан на нормальную multi-site схему:

- один общий `Traefik` в Docker держит `80/443`
- он выпускает и продлевает бесплатные SSL-сертификаты Let's Encrypt
- каждое приложение живет в своем контейнере и не публикует порты наружу
- сайты не мешают друг другу на одном сервере

Это важно: если на сервере уже есть приложение на `80/443` и оно должно остаться, поднимать этот проект отдельным контейнером с прямым bind на `80/443` нельзя. Оба приложения должны стоять за одним общим reverse proxy.

## Сценарий установки

### 1. Один раз на сервер: общий Traefik

Если общего dockerized reverse proxy еще нет, установи его:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/proxy/install.sh | ACME_EMAIL=admin@example.com bash
```

Этот шаг:

1. поднимает общий `Traefik`
2. создает общую docker network `edge`
3. настраивает автоматический Let's Encrypt

Если на сервере уже есть свой reverse proxy, этот шаг не нужен. Но тогда приложение должно быть подключено к той же proxy-схеме и той же внешней docker network.

### 2. Деплой самого приложения

Публичный репозиторий:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | DOMAIN=example.com bash
```

Приватный репозиторий:

```bash
export GITHUB_TOKEN=your_github_token
curl -fsSL \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.raw" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/NGPpQr0oWJ12/my-ossetia-tour/contents/deploy/install.sh?ref=main" | DOMAIN=example.com bash
```

Что делает `deploy/install.sh`:

1. клонирует или обновляет репозиторий в `$HOME/apps/my-ossetia-tour`
2. спрашивает домен при первом запуске или берет его из `DOMAIN=...`
3. сохраняет конфиг в `deploy/.env.production`
4. проверяет, что общая proxy-network существует
5. собирает и поднимает контейнер приложения

## Переменные

- `APP_DIR` — директория проекта на сервере
- `BRANCH` — ветка для деплоя
- `REPO_URL` — URL репозитория
- `DOMAIN` — домен сайта
- `TRAEFIK_NETWORK` — имя внешней сети общего proxy, по умолчанию `edge`
- `GITHUB_TOKEN` — токен для приватного GitHub-репозитория
- `FORCE_RECONFIGURE=1` — переспросить домен
- `ACME_EMAIL` — email для Let's Encrypt при установке общего `Traefik`

## Ручные команды

Приложение:

```bash
docker compose --env-file deploy/.env.production up -d --build
docker compose logs -f
docker compose down
```

Общий proxy:

```bash
docker compose -f deploy/proxy/compose.yaml --env-file deploy/proxy/.env up -d
docker compose -f deploy/proxy/compose.yaml logs -f
```

## Ограничение

Если текущее приложение на сервере уже само напрямую занимает `80/443`, сначала нужно перевести и его под общий reverse proxy. Иначе два сайта одновременно с автоматическим SSL на одном сервере работать не смогут.
