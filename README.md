# WikiLive

Коллаборативная вики на $mol + Giper Baza.


## Docker

```bash
docker compose up --build
# Open http://localhost:9081/bog/wiki/app/-/test.html
```

Пересборка без кэша:

```bash
docker compose build --no-cache && docker compose up
```

## Build

```bash
npx mam bog/wiki/app
```

Бандл в папке `bog/wiki/app/-/`.

## Tauri -- Полная мультиплатформа ( Win Lin Mac Ios Android )

```bash
cd src-tauri && cargo tauri dev
```
