import assert from 'node:assert/strict';
import { test } from 'node:test';

const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

function endpoint(path) {
  return `${baseUrl}${path}`;
}

async function readJson(response) {
  const text = await response.text();
  assert.ok(text, `Expected JSON body for ${response.url}`);
  return JSON.parse(text);
}

function unwrapData(body) {
  return body && typeof body === 'object' && 'data' in body ? body.data : body;
}

function getSlug(record) {
  assert.ok(record && typeof record === 'object', 'Expected URL record object');
  assert.equal(typeof record.slug, 'string', 'Expected record.slug to be a string');
  assert.ok(record.slug.length > 0, 'Expected record.slug to be non-empty');
  return record.slug;
}

function getLongUrl(record) {
  return record.longUrl || record.url || record.originalUrl;
}

async function createUrl(longUrl) {
  const response = await fetch(endpoint('/api/urls'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ longUrl }),
  });

  assert.equal(response.status, 201, 'POST /api/urls should create a short URL');
  return unwrapData(await readJson(response));
}

test('GET /api/health returns a successful JSON response', async () => {
  const response = await fetch(endpoint('/api/health'));

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /json/i);

  const body = await readJson(response);
  assert.equal(typeof body, 'object');
});

test('URL lifecycle supports create, list, detail, and redirect', async () => {
  const longUrl = `https://example.com/integration-check?case=${Date.now()}`;
  const created = await createUrl(longUrl);
  const slug = getSlug(created);

  assert.equal(getLongUrl(created), longUrl);

  const listResponse = await fetch(endpoint('/api/urls'));
  assert.equal(listResponse.status, 200, 'GET /api/urls should succeed');

  const listBody = unwrapData(await readJson(listResponse));
  assert.ok(Array.isArray(listBody), 'GET /api/urls should return an array or { data: [] }');
  assert.ok(listBody.some((item) => item.slug === slug), 'Created slug should appear in URL list');

  const detailResponse = await fetch(endpoint(`/api/urls/${encodeURIComponent(slug)}`));
  assert.equal(detailResponse.status, 200, 'GET /api/urls/:slug should return details');

  const detail = unwrapData(await readJson(detailResponse));
  assert.equal(getSlug(detail), slug);
  assert.equal(getLongUrl(detail), longUrl);

  const redirectResponse = await fetch(endpoint(`/${encodeURIComponent(slug)}`), {
    redirect: 'manual',
  });

  assert.ok([301, 302, 307, 308].includes(redirectResponse.status), 'GET /:slug should redirect');
  assert.equal(redirectResponse.headers.get('location'), longUrl);
});

test('POST /api/urls rejects invalid payloads', async () => {
  for (const body of [{}, { longUrl: 'not-a-url' }]) {
    const response = await fetch(endpoint('/api/urls'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    assert.equal(response.status, 400);
  }
});

test('unknown slugs return 404 for details and redirects', async () => {
  const slug = `missing-${Date.now()}`;

  const detailResponse = await fetch(endpoint(`/api/urls/${slug}`));
  assert.equal(detailResponse.status, 404);

  const redirectResponse = await fetch(endpoint(`/${slug}`), { redirect: 'manual' });
  assert.equal(redirectResponse.status, 404);
});
