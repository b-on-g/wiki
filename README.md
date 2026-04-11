# WikiLive (`bog/wiki`)

Коллаборативная вики на $mol + Giper Baza. Контекст для агента: [`AGENTS.md`](AGENTS.md).

Команды **Docker / Tauri / `npx mam`** ниже выполняйте из каталога **`bog/wiki`** (корень модуля), если не указано иначе.

## Документация

| Файл | Назначение |
|------|------------|
| [`docs/WikiLive_features.md`](docs/WikiLive_features.md) | Чек-лист фич и фокус по баллам |
| [`PRD.md`](PRD.md) | ТЗ трека, критерии жюри |
| [`docs/FUSION-API.yaml`](docs/FUSION-API.yaml) | **OpenAPI 3.0** — API Fusion (MWS Tables), пути `/fusion/v1/...` |
| [`docs/API_MWS_GPT.md`](docs/API_MWS_GPT.md) | MWS GPT, если нужны ИИ-допы |
| [Design Kit (Figma)](https://www.figma.com/design/iUKNWUxfZYSyRhADjDEHYs/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B?node-id=0-1&p=f&t=0XIWXIt3tVWf8JdO-0) | Макеты (доп. фича «Design Kit») |

## Горячие клавиши

По [`docs/WikiLive_features.md`](docs/WikiLive_features.md) (обязательная фича 6) здесь должен быть **перечень** горячих клавиш slash-menu и ключевых команд редактора. Заполните после выбора редактора и фиксации биндингов.

| Действие | Сочетание |
|----------|-----------|
| *TODO* | … |

## Docker

```bash
docker compose up --build
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
