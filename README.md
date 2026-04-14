## Docker

```bash
docker compose build --no-cache && docker compose up
# Open http://localhost:9081/bog/wiki/app/-/test.html
```

Пересборка без кэша:

```bash
docker compose build --no-cache && docker compose up
```

**Без Docker:** из **корня репозитория MAM** (родительский каталог `bog/`): `npm install` при первом клоне, затем `npm start` — откройте приложение, например `http://localhost:9080/bog/wiki/app/-/test.html` (точный порт смотрите в выводе терминала).

## Build

```bash
npx mam bog/wiki/app
```

Бандл в папке `bog/wiki/app/-/`.

## Tauri -- Полная мультиплатформа ( Win Lin Mac Ios Android )

```bash
cd src-tauri && cargo tauri dev
```


## Запуск локальной гипербазы. После npm run start
```bash
+ giper/baza/app/run port=9090
```
