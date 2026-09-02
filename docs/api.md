# URL Shortener API

This document defines the expected black-box HTTP contract for the URL shortener service. Examples assume the API is running at `http://localhost:3000`.

## Health Check

`GET /api/health`

Expected response:

- Status: `200`
- Body: JSON object containing service status, for example:

```json
{
  "data": {
    "status": "ok",
    "service": "url-forge-api",
    "timestamp": "2026-09-02T00:00:00.000Z"
  }
}
```

## Create Short URL

`POST /api/urls`

Request body:

```json
{ "longUrl": "https://example.com/articles/a-long-path" }
```

Expected response:

- Status: `201`
- Body: JSON object with a generated slug and a short URL.

```json
{
  "data": {
    "slug": "abc123",
    "originalUrl": "https://example.com/articles/a-long-path",
    "longUrl": "https://example.com/articles/a-long-path",
    "shortPath": "/abc123",
    "shortUrl": "http://localhost:3000/abc123",
    "clicks": 0,
    "createdAt": "2026-09-02T00:00:00.000Z"
  }
}
```

Validation expectations:

- Missing `longUrl` returns `400`.
- Invalid URLs return `400`.
- Optional `customSlug` values must be URL-safe and unique.

## List URLs

`GET /api/urls`

Expected response:

- Status: `200`
- Body: JSON object or array containing known shortened URLs.

```json
{
  "data": [
    {
      "slug": "abc123",
      "originalUrl": "https://example.com/articles/a-long-path",
      "longUrl": "https://example.com/articles/a-long-path",
      "shortUrl": "http://localhost:3000/abc123",
      "clicks": 0
    }
  ]
}
```

## Get URL Details

`GET /api/urls/:slug`

Expected response:

- Status: `200` for an existing slug.
- Status: `404` for an unknown slug.
- Body: URL metadata for the slug.

## Delete URL

`DELETE /api/urls/:slug`

Expected response:

- Status: `204` for an existing slug.
- Status: `404` for an unknown slug.
- Status: `400` for an invalid slug.

## Redirect

`GET /:slug`

Expected response:

- Status: one of `301`, `302`, `307`, or `308`.
- `Location` header points to the original long URL.
- Unknown slugs return `404`.
