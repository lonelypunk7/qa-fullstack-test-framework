# QA Fullstack Test Framework

Playwright-based template for the QA Fullstack Engineer test assignment.

## Included

- UI tests (`tests/ui`) against a public web resource
- API tests (`tests/api`) against public API endpoints
- Shared helper for API requests (`utils/api-client.ts`)
- HTML report generation

## Stack

- TypeScript
- Playwright Test

## Install

```bash
npm install
npx playwright install chromium
```

## Run tests

```bash
# all tests
npm test

# only UI
npm run test:ui

# only API
npm run test:api
```

## Open report

```bash
npm run report
```
