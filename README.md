# QA Fullstack Test Framework

Шаблон на базе Playwright для тестового задания QA Fullstack Engineer.

UI-тесты в этом проекте покрывают витрину М.Видео (интернет-магазин электроники и бытовой техники): поиск, саджест, карточки товаров, сортировку и визуальные снапшоты на desktop и mobile.

## Что входит

- UI-тесты (`tests/ui`) для публичного веб-ресурса
- API-тесты (`tests/api`) для публичных API-эндпоинтов
- Общий helper для API-запросов (`utils/api-client.ts`)
- Генерация HTML-отчёта

## Стек

- TypeScript
- Playwright Test

## Установка

```bash
npm install
npx playwright install chromium
```

## Запуск тестов

```bash
# все тесты
npm test

# только UI
npm run test:ui

# только API
npm run test:api
```

## Запуск по типам тестов

```bash
# UI desktop функциональные
npx playwright test tests/ui/desktop/functional --project=ui-chromium

# UI desktop снапшотные
npx playwright test tests/ui/desktop/screenshot --project=ui-chromium

# UI mobile функциональные
npx playwright test tests/ui/mobile/functional --project=ui-mobile-chromium

# UI mobile снапшотные
npx playwright test tests/ui/mobile/screenshot --project=ui-mobile-chromium

# API (все)
npx playwright test tests/api

# API (пример PokemonAPI)
npx playwright test tests/api/pokemon.api.spec.ts
```

## Открыть отчёт

```bash
npm run report
```
