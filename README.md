# My Ossetia Tour

Современный сайт авторских туров по Северной Осетии на `React 19` + `TypeScript` + `Vite`.

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

Установка и запуск:

```bash
npm install
npm run dev
```

Сборка и проверка типов:

```bash
npm run build
npm run lint
```

## Docker-деплой

Проект подготовлен к изолированному деплою в Docker:

- приложение собирается в production-образ
- статика отдается через `Caddy`
- SSL-сертификат выпускается и продлевается автоматически
- сертификаты и конфиг хранятся в docker volumes
- на хосте не требуется отдельно ставить `nginx` или `certbot`

### Что нужно на сервере

- `Docker`
- `Docker Compose` или `docker-compose`
- `Git`
- открытые порты `80` и `443`
- домен, уже направленный на IP сервера

### Первый деплой

Для публичного репозитория:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | bash
```

Если серверный shell не дает интерактивно ответить на вопрос о домене, передай домен явно:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | DOMAIN=example.com bash
```

Для приватного репозитория:

```bash
export GITHUB_TOKEN=your_github_token
curl -fsSL \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.raw" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/NGPpQr0oWJ12/my-ossetia-tour/contents/deploy/install.sh?ref=main" | bash
```

Неинтерактивный вариант:

```bash
export GITHUB_TOKEN=your_github_token
curl -fsSL \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github.raw" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/NGPpQr0oWJ12/my-ossetia-tour/contents/deploy/install.sh?ref=main" | DOMAIN=example.com bash
```

Что делает скрипт:

1. Клонирует репозиторий в `$HOME/apps/my-ossetia-tour`.
2. При первом запуске спрашивает домен сайта.
3. Сохраняет домен в `deploy/.env.production`.
4. Собирает и поднимает docker-стек.
5. Дает `Caddy` автоматически получить бесплатный SSL-сертификат.

### Повторный деплой или обновление

Для публичного репозитория запускается той же командой:

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | bash
```

Для приватного репозитория используй ту же команду через GitHub API и `GITHUB_TOKEN`.

Если `deploy/.env.production` уже существует, сохраненный домен будет использован повторно.

### Полезные переменные

```bash
curl -fsSL https://raw.githubusercontent.com/NGPpQr0oWJ12/my-ossetia-tour/main/deploy/install.sh | APP_DIR=/srv/my-ossetia-tour BRANCH=main bash
```

Поддерживаются:

- `APP_DIR` — куда клонировать проект на сервере
- `BRANCH` — какая ветка деплоится
- `REPO_URL` — URL репозитория
- `DOMAIN` — домен сайта, чтобы не ждать интерактивного ввода
- `GITHUB_TOKEN` — токен для доступа к приватному GitHub-репозиторию по HTTPS
- `FORCE_RECONFIGURE=1` — повторно спросить домен

### Ручное управление

Из директории проекта на сервере:

```bash
docker compose --env-file deploy/.env.production up -d --build
docker compose logs -f
docker compose down
```

### Ограничение

Текущая схема занимает порты `80` и `443` на сервере. Если они уже используются другим сервисом, нужно либо освободить их, либо переходить на общую reverse-proxy архитектуру для нескольких сайтов.

## Структура

- [src/App.tsx](/c:/Users/22/Desktop/my-ossetia-tour/src/App.tsx)
- [src/pages/Home.tsx](/c:/Users/22/Desktop/my-ossetia-tour/src/pages/Home.tsx)
- [src/pages/Tours.tsx](/c:/Users/22/Desktop/my-ossetia-tour/src/pages/Tours.tsx)
- [src/pages/TourDetail.tsx](/c:/Users/22/Desktop/my-ossetia-tour/src/pages/TourDetail.tsx)
- [src/index.css](/c:/Users/22/Desktop/my-ossetia-tour/src/index.css)
- [deploy/install.sh](/c:/Users/22/Desktop/my-ossetia-tour/deploy/install.sh)
- [deploy/README.md](/c:/Users/22/Desktop/my-ossetia-tour/deploy/README.md)
