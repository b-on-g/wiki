# Генерация типов из OpenAPI (Swagger) YAML для MAM / `$mol` и FQN

Инструкция описывает, как из спецификации **OpenAPI 3** получить TypeScript-типы, которые:

- живут в **`namespace $`** (как принято в MAM);
- экспортируются **под именами в стиле FQN** (`$…`), согласованными с **путём папок** модуля;
- удобно используются в **`$bog_wiki_model`** и во view (`namespace $.$$`) без `any`.

Пример в этом репозитории: модуль **`bog/wiki/model/gen`**, файл **`model/gen/gen.ts`**, префикс **`$bog_wiki_model_gen_`**.

---

## 1. Соглашение: папки и префикс FQN

В MAM глобальные сущности часто именуют так: **`$` + путь к модулю**, где **сегменты пути разделены `_`**, без `_` в именах самих папок.

| Путь к модулю (пример) | Префикс для сгенерированных **экспортируемых** типов |
|--------------------------|-----------------------------------------------------|
| `bog/wiki/model/gen`     | `$bog_wiki_model_gen_`                              |

Класс модели в **`bog/wiki/model/model.ts`** соответствует уровню **`bog/wiki/model`**:

| Файл | Ожидаемое имя класса |
|------|----------------------|
| `bog/wiki/model/model.ts` | `$bog_wiki_model` |

Так разработчик по имени сразу видит, **где лежит код**.

---

## 2. Исходник: YAML/JSON OpenAPI

- Кладите спецификацию в репозиторий, например: **`bog/wiki/docs/FUSION-API.yaml`** (путь зафиксируйте в команде генерации и в постобработке).
- После изменений спеки типы нужно **перегенерировать** (шаги 3–4).

---

## 3. Генерация «сырых» типов: `openapi-typescript`

Установка не обязательна: можно вызывать через `npx`.

Из корня рабочей копии MAM (подставьте свой путь к YAML и выходному файлу):

```bash
cd c:/sites/mam
npx --yes openapi-typescript bog/wiki/docs/FUSION-API.yaml -o bog/wiki/model/gen/gen.raw.ts
```

На выходе — файл в стиле openapi-typescript: обычно **`export interface paths`**, **`export interface components`**, **`export interface operations`**, **`export type webhooks`**, иногда **`export type $defs`**, комментарий «auto-generated».

**Важно:** этот файл **не коммитят как финальный** для MAM: следующий шаг — обёртка под `namespace $` и FQN (или автоматический постскрипт).

---

## 4. Обёртка под MAM: `namespace $` и только FQN в `export`

### 4.1. Цель

- Весь сгенерированный код поместить в **`namespace $ { … }`**.
- **Внутри** файла сохранить **короткие** имена (`paths`, `components`, `operations`, …), чтобы **не ломать** тысячи ссылок вида `components['schemas']['…']` и `operations['…']`.
- **Наружу** из модуля отдавать **только** типы с именами **`$<префикс_FQN><суффикс>`**, где префикс согласован с папкой `…/model/gen/`.

### 4.2. Алгоритм для каждого верхнего уровня openapi-typescript

Для каждой сущности, которая раньше была **`export interface …`** или **`export type …`**:

1. Найти объявление с **`export`**.
2. **Убрать `export`** у основного объявления (оставить, например, `interface paths` или `type webhooks`).
3. **Сразу после** закрытия этого блока (после соответствующей `}`) добавить строку:

   `export type $<ПРЕФИКС><ИмяДляFQN> = <внутреннее_имя>`

Внутреннее имя — то, что вы оставили на шаге 2 (`paths`, `components`, …).

### 4.3. Соответствие имён (пример `bog/wiki`)

| Внутреннее имя (без `export`) | Экспорт для FQN (пример) |
|-------------------------------|---------------------------|
| `paths`                       | `export type $bog_wiki_model_gen_paths = paths` |
| `webhooks`                    | `export type $bog_wiki_model_gen_webhooks = webhooks` |
| `components`                  | `export type $bog_wiki_model_gen_components = components` |
| заглушка defs (как в выводе генератора) | `export type $bog_wiki_model_gen_defs = …` |
| `operations`                  | `export type $bog_wiki_model_gen_operations = operations` |

Итоговый файл в репозитории: **`bog/wiki/model/gen/gen.ts`**, первая строка содержимого — объявление **`namespace $ {`**, последняя — закрывающая **`}`** для этого namespace.

**Замечание по `$defs`:** в OpenAPI 3.1 / JSON Schema встречается **`$defs`**. Генератор может вывести пустую заглушку `Record<string, never>`. Внутреннее имя (`defs` / `$defs`) берите из фактического вывода `openapi-typescript`, затем тем же правилом добавьте **`export type $bog_wiki_model_gen_defs = …`**.

### 4.4. Почему не переименовывать `components` внутри файла

Тело **`components`** содержит массу ссылок **`components['schemas']['SomeName']`**. Достаточно оставить интерфейс **`components`** без `export` и один раз экспортировать **`$bog_wiki_model_gen_components = components`**. Глобальное имя для кода — **`$bog_wiki_model_gen_components`**.

---

## 5. Модель API: `bog/wiki/model/model.ts`

- Файл в **`namespace $`**.
- Класс **`$bog_wiki_model`** наследует **`$mol_object`**.
- Для HTTP используйте **`$mol_fetch`**; раз **`json()`** с точки зрения типов широкий, вводится обобщение:

```ts
request<T>(url: string) {
    return $mol_fetch.json(this.base_url() + url, { /* headers */ }) as T
}
```

- Методы API задают возвращаемый тип через схемы из генератора, например:

```ts
get_spaces(): $bog_wiki_model_gen_components['schemas']['ResponseGetSpaces'] {
    return this.request('/spaces')
}
```

Имя схемы (`ResponseGetSpaces`, `GetRecordsData`, …) смотрите в **`gen.ts`** в `components.schemas`.

---

## 6. View и `namespace $.$$`

В расширениях view (`editor.view.ts` и т.д.) используется **`namespace $.$$`**. Типы из **`namespace $`** (в том числе **`$bog_wiki_model_gen_components`**) доступны без отдельного `import`.

Пример для реактивных полей с **`@$mol_mem`**:

```ts
data_spaces(next?: $bog_wiki_model_gen_components['schemas']['ResponseGetSpaces']) { … }
data_table(next?: $bog_wiki_model_gen_components['schemas']['GetRecordsData']) { … }
```

Так устраняется **`any`**, вывод типов идёт вниз по коду.

---

## 7. Повторная генерация

1. Обновить YAML.
2. Выполнить команду **`openapi-typescript`** (в сырой или временный файл).
3. Повторить шаг **§4** (вручную или постскриптом): обернуть в **`namespace $`**, снять лишние **`export`**, добавить **`export type $bog_wiki_model_gen_*`**.

**Не править** финальный **`gen.ts`** руками между генерациями — только перезаписывать пайплайном.

---

## 8. Другой модуль / другой префикс

Если генерация лежит, например, в **`my/app/api/gen/`**, префикс FQN будет **`$my_app_api_gen_`**, а модель — **`my/app/api/model.ts`** → класс **`$my_app_api_model`** (по соглашению путей в вашем проекте). Логика шагов та же: **путь папок → префикс `$`**, **`gen.ts` в `namespace $`**, наружу только **`export type $…`**.

---

## 9. Краткий чеклист

- [ ] YAML OpenAPI в репозитории, путь известен.
- [ ] `npx openapi-typescript … -o …gen.raw.ts` (или сразу в промежуточный файл).
- [ ] Содержимое приведено к **`namespace $`**, внутренние имена `paths` / `components` / … без лишнего `export`.
- [ ] Добавлены **`export type $…_paths`**, **`…_components`**, **`…_operations`**, **`…_webhooks`**, **`…_defs`** (по факту вывода).
- [ ] **`model.ts`**: **`request<T>`**, методы с типами из **`$…_gen_components['schemas'][…]`**.
- [ ] View: **`namespace $.$$`**, параметры без **`any`**, при необходимости инлайн **`$…_gen_components['schemas'][…]`**.
