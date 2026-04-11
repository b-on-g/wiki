# API MWS GPT

Документация по обращению к API генеративных моделей MWS.

| | |
|---|---|
| **Источник** | экспорт из PDF, оформление для удобства чтения |
| **Дата экспорта (оригинал)** | 02/10/2025 |

**Базовый URL:** `https://api.gpt.mws.ru`

**Авторизация:** заголовок `Authorization: Bearer <YOUR_API_KEY>` (ключ не хранить в репозитории).

---

## Оглавление

1. Листинг моделей (`GET /v1/models`)
2. Chat Completion (`POST /v1/chat/completions`)
3. Completion (`POST /v1/completions`)
4. Embeddings (`POST /v1/embeddings`)
5. Доступные модели и токены
6. Промпты: основы

---

## 1. Листинг моделей — `GET /v1/models`

Возвращает список доступных моделей.

| | |
|---|---|
| **Метод** | `GET` |
| **Эндпоинт** | `/v1/models` |
| **Полный URL** | `https://api.gpt.mws.ru/v1/models` |

### Пример запроса

```bash
curl -X GET "https://api.gpt.mws.ru/v1/models" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Пример ответа

```json
{
  "data": [
    {
      "id": "mws-gpt-alpha",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai"
    },
    {
      "id": "kodify-2.0",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai"
    },
    {
      "id": "cotype-preview-32k",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai"
    }
  ]
}
```

---

## 2. Chat Completion — `POST /v1/chat/completions`

Диалоговое взаимодействие с учётом контекста; поддержка нескольких сообщений подряд.

| | |
|---|---|
| **Метод** | `POST` |
| **Эндпоинт** | `/v1/chat/completions` |
| **Полный URL** | `https://api.gpt.mws.ru/v1/chat/completions` |

### Пример тела запроса (curl)

```bash
curl -X POST "https://api.gpt.mws.ru/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mts-anya",
    "messages": [
      {"role": "system", "content": "Ты помощник"},
      {"role": "user", "content": "Привет, как дела?"}
    ],
    "temperature": 0.6
  }'
```

> В исходном PDF в примере была опечатка в роли: `"role":"use"` — для API нужна роль **`user`**.

### Пример ответа (фрагмент)

```json
{
  "id": "chatcmpl-f6d4b004e9ba4e95b2cede3ca82040b4",
  "created": 1739133562,
  "model": "mts_anya",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Дела отлично, я готов помочь тебе в любых вопросах или задачах. Как я могу тебе помочь?",
        "role": "assistant",
        "tool_calls": null,
        "function_call": null
      }
    }
  ],
  "usage": {
    "completion_tokens": 28,
    "prompt_tokens": 51,
    "total_tokens": 79,
    "completion_tokens_details": null,
    "prompt_tokens_details": null
  },
  "service_tier": null,
  "prompt_logprobs": null
}
```

### Параметры запроса (chat)

| Параметр | Описание |
|----------|----------|
| `model` | Модель обработки текста |
| `messages` | Массив сообщений: у каждого элемента есть `role` (`system`, `user`, `assistant`) и `content` |
| `temperature` | Случайность вывода: `0.0` — более детерминированно, `1.0` — более разнообразно |
| `max_tokens` | Максимум возвращаемых токенов |
| `n` | Целое число — сколько вариантов ответа вернуть |
| `presence_penalty` | От `-2.0` до `2.0` — штраф за повтор токенов, уже присутствующих в истории чата |
| `frequency_penalty` | От `-2.0` до `2.0` — штраф за частые токены |

---

## 3. Completion — `POST /v1/completions`

Генерация и продолжение текста по одному промпту (не чат).

| | |
|---|---|
| **Метод** | `POST` |
| **Эндпоинт** | `/v1/completions` |
| **Полный URL** | `https://api.gpt.mws.ru/v1/completions` |

### Пример тела запроса (curl)

```bash
curl -X POST "https://api.gpt.mws.ru/v1/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mts-anya",
    "prompt": "Что такое искусственный интеллект?",
    "temperature": 0.6,
    "max_tokens": 150,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0,
    "stop": ["\n"]
  }'
```

### Пример ответа (фрагмент)

Ответ содержит поля вроде `id`, `object` (`text_completion`), `model`, `choices[]` с текстом продолжения, `usage` (токены prompt/completion/total).

### Параметры запроса (completions)

| Параметр | Описание |
|----------|----------|
| `model` | Выбор модели |
| `prompt` | Текст запроса |
| `max_tokens` | Максимум возвращаемых токенов |
| `temperature` | Случайность: `0.0`…`1.0` |
| `top_p` | Альтернативный способ контроля случайности |
| `presence_penalty` | От `-2.0` до `2.0` — штраф за повтор токенов в истории |
| `frequency_penalty` | От `-2.0` до `2.0` — штраф за частые токены |
| `stop` | Условие остановки генерации (например, список строк) |

---

## 4. Embeddings — `POST /v1/embeddings`

Векторное представление текста: классификация, семантический поиск, сравнение текстов.

| | |
|---|---|
| **Метод** | `POST` |
| **Эндпоинт** | `/v1/embeddings` |
| **Полный URL** | `https://api.gpt.mws.ru/v1/embeddings` |

### Пример запроса

```bash
curl -X POST "https://api.gpt.mws.ru/v1/embeddings" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "model": "bge-m3", "input": "как у тебя дела?" }'
```

### Параметры

| Параметр | Описание |
|----------|----------|
| `model` | Модель эмбеддингов |
| `input` | Текст для преобразования в эмбеддинг |

---

## 5. Доступные модели и токены

### Модели (примеры из API)

| Модель |
|--------|
| `mws-gpt-alpha` |
| `kodify-2.0` |
| `cotype-preview-32k` |
| `bge-m3` |

Актуальный список лучше получать через эндпоинт листинга моделей (раздел 1).

### Оценка токенов

- примерно **2–3 русских слова** ≈ **1 токен**
- примерно **3–4 английских слова** ≈ **1 токен**

---

## 6. Промпты: основы

### Что такое промпт

**Промпт** — входные данные для генеративной модели, задающие желаемый результат. Может быть текст, изображение, звук и т.д.

**Шаблон промпта** — незавершённый промпт с переменными (подстановками). Пример для бинарной классификации твитов:

```text
Классифицируй твит как «положительный» или «отрицательный»: {TWEET}.
```

Подставив конкретный твит, получают экземпляр промпта для модели.

Качество ответа зависит от формулировки и объёма контекста. В промпт обычно входят **инструкция или вопрос**, а также при необходимости **контекст, входные данные, примеры**.

### Роли в API

При обращении через API промпт можно структурировать **ролями**: `system`, `user`, `assistant`. В консоли им могут соответствовать поля вроде «Инструкция», «Запрос», «Ответ». Строгая структура не обязательна; в простых примерах часто используют только сообщение с ролью `user`.

### Пример: короткий промпт

**Промпт:** «Что такое замок?»

Модель может интерпретировать «замок» по-разному (архитектура vs дверной замок). Чтобы сузить смысл, добавьте контекст:

**Промпт:** «Что такое замок? (речь идёт о дверных замках)»

### Пример тела для Chat Completion (JSON)

```json
{
  "model": "gpt-4",
  "messages": [
    { "role": "system", "content": "Ты эксперт по искусственному интеллекту." },
    { "role": "user", "content": "Как работает машинное обучение?" }
  ]
}
```

### Полный пример запроса (curl)

```bash
curl -X POST "https://api.gpt.mws.ru/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      { "role": "system", "content": "Ты эксперт по AI." },
      { "role": "user", "content": "Как работает машинное обучение?" }
    ],
    "temperature": 0.7
  }'
```

---

## См. также

- Оригинал: `API Документация MWS GPT.pdf` в этой папке.
