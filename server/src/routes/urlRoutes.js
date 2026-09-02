import { Router } from 'express';
import {
  createShortUrl,
  getRecentUrls,
  getUrlBySlug,
  hasSlug
} from '../store/urlStore.js';
import { generateSlug } from '../utils/slug.js';
import { validateCreateUrlPayload, validateSlug } from '../utils/validation.js';

const router = Router();

router.post('/', (req, res) => {
  const payload = validateCreateUrlPayload(req.body);

  if (!payload.valid) {
    return res.status(400).json({ error: payload.error });
  }

  const slug = payload.customSlug || buildUniqueSlug();

  if (hasSlug(slug)) {
    return res.status(409).json({ error: 'Slug is already in use.' });
  }

  const link = createShortUrl({
    originalUrl: payload.url,
    slug
  });

  return res.status(201).json({ data: link });
});

router.get('/', (req, res) => {
  const limit = parseLimit(req.query.limit);
  res.json({ data: getRecentUrls(limit) });
});

router.get('/:slug', (req, res) => {
  const slugResult = validateSlug(req.params.slug);

  if (!slugResult.valid) {
    return res.status(400).json({ error: slugResult.error });
  }

  const link = getUrlBySlug(req.params.slug);

  if (!link) {
    return res.status(404).json({ error: 'Short URL not found.' });
  }

  return res.json({ data: link });
});

function buildUniqueSlug() {
  let slug = generateSlug();

  while (hasSlug(slug)) {
    slug = generateSlug();
  }

  return slug;
}

function parseLimit(value) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 20;
  }

  return Math.min(parsed, 100);
}

export default router;
