import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import app from '../src/app.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://localhost:${port}`;
  process.env.BASE_URL = baseUrl;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('creates, lists, reads, and redirects a shortened URL', async () => {
  const longUrl = `https://example.com/test-${Date.now()}`;

  const createResponse = await fetch(`${baseUrl}/api/urls`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ longUrl })
  });

  assert.equal(createResponse.status, 201);
  const created = (await createResponse.json()).data;
  assert.equal(created.originalUrl, longUrl);
  assert.equal(created.longUrl, longUrl);
  assert.equal(created.shortUrl, `${baseUrl}/${created.slug}`);

  const listResponse = await fetch(`${baseUrl}/api/urls`);
  assert.equal(listResponse.status, 200);
  const links = (await listResponse.json()).data;
  assert.ok(links.some((link) => link.slug === created.slug));

  const detailResponse = await fetch(`${baseUrl}/api/urls/${created.slug}`);
  assert.equal(detailResponse.status, 200);
  assert.equal((await detailResponse.json()).data.slug, created.slug);

  const redirectResponse = await fetch(`${baseUrl}/${created.slug}`, {
    redirect: 'manual'
  });
  assert.equal(redirectResponse.status, 302);
  assert.equal(redirectResponse.headers.get('location'), longUrl);
});

test('rejects invalid URLs and duplicate custom slugs', async () => {
  const invalidResponse = await fetch(`${baseUrl}/api/urls`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ longUrl: 'not-a-url' })
  });

  assert.equal(invalidResponse.status, 400);

  const body = {
    longUrl: 'https://example.com/custom',
    customSlug: `custom-${Date.now()}`
  };

  const firstResponse = await fetch(`${baseUrl}/api/urls`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  assert.equal(firstResponse.status, 201);

  const duplicateResponse = await fetch(`${baseUrl}/api/urls`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  assert.equal(duplicateResponse.status, 409);
});
