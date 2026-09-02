# Testing Guide

These checks validate the URL shortener as a black-box HTTP service. They do not assume a specific database, framework layout, or internal module design.

## Prerequisites

- Node.js 18 or newer for global `fetch` and the built-in test runner.
- The app running locally, usually at `http://localhost:3000`.

Set a custom target with `BASE_URL`:

```powershell
$env:BASE_URL = "http://localhost:3000"
```

## Automated Integration Tests

Run the black-box integration suite:

```powershell
node --test tests/integration/url-shortener.test.mjs
```

If the root package scripts are available, this should also work:

```powershell
npm run test:integration
```

The suite validates:

- `GET /api/health` returns a successful JSON response.
- `POST /api/urls` accepts a valid `longUrl` and returns a slug.
- `GET /api/urls` includes created URL records.
- `GET /api/urls/:slug` returns details for the created slug.
- `GET /:slug` redirects to the original long URL.
- Invalid or missing URL input returns `400`.
- Unknown slugs return `404`.

## Manual Checks

Use these checks when the implementation is still changing or when debugging failures.

Health:

```powershell
curl http://localhost:3000/api/health
```

Create:

```powershell
curl -X POST http://localhost:3000/api/urls -H "Content-Type: application/json" -d "{\"longUrl\":\"https://example.com/manual-check\"}"
```

List:

```powershell
curl http://localhost:3000/api/urls
```

Detail:

```powershell
curl http://localhost:3000/api/urls/abc123
```

Redirect headers:

```powershell
curl -i http://localhost:3000/abc123
```

Replace `abc123` with a slug returned by the create endpoint.
