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

## Прод-деплой

Проект рассчитан на схему с общим reverse proxy:

- один общий `Traefik` в Docker держит `80/443`
- Traefik выпускает и продлевает SSL-сертификаты Let's Encrypt
- приложение работает в отдельном контейнере и не публикует порты наружу
- несколько сайтов могут жить на одном сервере через общую сеть `edge`

Если на сервере уже есть свой reverse proxy, второй поднимать не нужно. Приложение должно быть подключено к той же proxy-схеме и той же внешней Docker-сети.

## Первый запуск на сервере

### 1. Установить общий Traefik

Нужно сделать один раз на сервер:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/proxy/install.sh | ACME_EMAIL=admin@example.com bash
```

Что делает скрипт:

1. Поднимает общий `Traefik`.
2. Создаёт внешнюю Docker-сеть `edge`.
3. Настраивает автоматический Let's Encrypt.

### 2. Задеплоить приложение

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

Скрипт `deploy/install.sh`:

1. Клонирует или обновляет репозиторий в `$HOME/apps/my-ossetia-tour`.
2. Сохраняет production-конфиг в `deploy/.env.production`.
3. Проверяет наличие внешней proxy-сети.
4. Собирает и поднимает контейнер приложения.

## Как обновить деплой на проде

Если приложение уже развернуто, обновление обычно выглядит так:

```bash
cd ~/apps/my-ossetia-tour
git pull
docker compose --env-file deploy/.env.production up -d --build
docker compose logs -f --tail=100
```

Что делает эта последовательность:

1. Переходит в директорию приложения на сервере.
2. Подтягивает свежий код из репозитория.
3. Пересобирает Docker-образ и перезапускает контейнер.
4. Показывает последние логи, чтобы быстро проверить запуск.

Если нужно обновить конкретную ветку:

```bash
cd ~/apps/my-ossetia-tour
git fetch
git checkout main
git pull origin main
docker compose --env-file deploy/.env.production up -d --build
```

Если хотите обновлять не вручную, а тем же install-скриптом, можно просто повторно запустить:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | DOMAIN=example.com bash
```

Это тоже обновит код и пересоберёт контейнер.

## Проверка после обновления

Полезные команды на сервере:

```bash
docker ps
docker compose logs --tail=100
docker compose logs -f
```

Если нужно переспросить домен и пересобрать конфиг:

```bash
FORCE_RECONFIGURE=1 bash deploy/install.sh
```

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

Если другое приложение на сервере уже напрямую занимает `80/443`, сначала его нужно перевести под общий reverse proxy. Два независимых приложения с прямым bind на `80/443` на одном сервере нормально сосуществовать не смогут.
