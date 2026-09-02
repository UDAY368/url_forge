const urlsBySlug = new Map();

export function createShortUrl({ originalUrl, slug }) {
  const now = new Date().toISOString();
  const shortPath = `/${slug}`;
  const link = {
    slug,
    originalUrl,
    longUrl: originalUrl,
    shortPath,
    shortUrl: `${getBaseUrl()}${shortPath}`,
    clicks: 0,
    createdAt: now
  };

  urlsBySlug.set(slug, link);
  return copyLink(link);
}

export function getUrlBySlug(slug) {
  const link = urlsBySlug.get(slug);
  return link ? copyLink(link) : null;
}

export function getRecentUrls(limit = 20) {
  return [...urlsBySlug.values()]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map(copyLink);
}

export function deleteUrlBySlug(slug) {
  return urlsBySlug.delete(slug);
}

export function hasSlug(slug) {
  return urlsBySlug.has(slug);
}

export function recordClick(slug) {
  const link = urlsBySlug.get(slug);

  if (!link) {
    return null;
  }

  link.clicks += 1;
  return copyLink(link);
}

function copyLink(link) {
  return { ...link };
}

function getBaseUrl() {
  return (process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, '');
}
