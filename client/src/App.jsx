import { useEffect, useMemo, useState } from 'react';

const API_BASE = '/api/urls';

function normalizeLink(record) {
  const shortUrl = record.shortUrl || record.short_url || record.shortLink || '';
  const slug = record.slug || record.shortCode || record.code || '';

  return {
    id: record.id || record._id || shortUrl || slug || record.longUrl,
    longUrl: record.longUrl || record.long_url || record.originalUrl || record.url || '',
    shortUrl,
    slug,
    clicks: record.clicks ?? record.visitCount ?? 0,
    createdAt: record.createdAt || record.created_at || ''
  };
}

function resolveShortUrl(link) {
  if (link.shortUrl) {
    return link.shortUrl.startsWith('http')
      ? link.shortUrl
      : `${window.location.origin}${link.shortUrl.startsWith('/') ? '' : '/'}${link.shortUrl}`;
  }

  if (link.slug) {
    return `${window.location.origin}/${link.slug}`;
  }

  return '';
}

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [links, setLinks] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const recentLinks = useMemo(() => links.slice(0, 6), [links]);

  useEffect(() => {
    let isActive = true;

    async function loadLinks() {
      try {
        setListLoading(true);
        const response = await fetch(API_BASE);
        if (!response.ok) {
          throw new Error('Could not load recent links.');
        }
        const payload = await response.json();
        const items = Array.isArray(payload) ? payload : payload.data || payload.urls || [];
        if (isActive) {
          setLinks(items.map(normalizeLink));
        }
      } catch (err) {
        if (isActive) {
          setError(err.message);
        }
      } finally {
        if (isActive) {
          setListLoading(false);
        }
      }
    }

    loadLinks();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!longUrl.trim()) {
      setError('Enter a URL to shorten.');
      return;
    }

    try {
      new URL(longUrl);
    } catch {
      setError('Enter a valid URL, including http:// or https://.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          longUrl: longUrl.trim(),
          customSlug: customSlug.trim() || undefined
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || payload.message || 'Unable to shorten this URL.');
      }

      const nextLink = normalizeLink(payload.data || payload.url || payload);
      setResult(nextLink);
      setLinks((current) => [nextLink, ...current.filter((link) => link.id !== nextLink.id)]);
      setLongUrl('');
      setCustomSlug('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyShortUrl(link) {
    const shortUrl = resolveShortUrl(link);
    if (!shortUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(link.id);
      window.setTimeout(() => setCopiedId(''), 1600);
    } catch {
      setError('Copy failed. Select and copy the link manually.');
    }
  }

  async function deleteLink(link) {
    if (!link.slug) {
      setError('This link cannot be deleted because it is missing a slug.');
      return;
    }

    setError('');

    try {
      setDeletingId(link.id);
      const response = await fetch(`${API_BASE}/${encodeURIComponent(link.slug)}`, {
        method: 'DELETE'
      });

      if (!response.ok && response.status !== 204) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || payload.message || 'Unable to delete this URL.');
      }

      setLinks((current) => current.filter((item) => item.id !== link.id));
      setResult((current) => (current?.id === link.id ? null : current));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId('');
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="intro">
          <p className="eyebrow">URL Forge</p>
          <h1>Short links, ready to share.</h1>
          <p className="lede">
            Create compact links with optional custom slugs, then copy and reuse recent links from one focused workspace.
          </p>
        </div>

        <form className="shorten-form" onSubmit={handleSubmit}>
          <label htmlFor="longUrl">Long URL</label>
          <input
            id="longUrl"
            type="url"
            value={longUrl}
            onChange={(event) => setLongUrl(event.target.value)}
            placeholder="https://example.com/very/long/link"
            disabled={loading}
          />

          <label htmlFor="customSlug">Custom slug</label>
          <div className="slug-row">
            <span>{window.location.origin}/</span>
            <input
              id="customSlug"
              type="text"
              value={customSlug}
              onChange={(event) => setCustomSlug(event.target.value)}
              placeholder="launch"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>
      </section>

      {error && <p className="message error">{error}</p>}

      {result && (
        <section className="result-panel" aria-live="polite">
          <div>
            <span className="section-label">New short URL</span>
            <a href={resolveShortUrl(result)} target="_blank" rel="noreferrer">
              {resolveShortUrl(result)}
            </a>
          </div>
          <button type="button" className="secondary-button" onClick={() => copyShortUrl(result)}>
            {copiedId === result.id ? 'Copied' : 'Copy'}
          </button>
        </section>
      )}

      <section className="links-section">
        <div className="section-heading">
          <div>
            <span className="section-label">History</span>
            <h2>Recent links</h2>
          </div>
          {listLoading && <span className="loading-text">Loading...</span>}
        </div>

        {!listLoading && recentLinks.length === 0 ? (
          <p className="empty-state">No recent links yet. Shorten a URL to start the list.</p>
        ) : (
          <div className="link-list">
            {recentLinks.map((link) => {
              const shortUrl = resolveShortUrl(link);

              return (
                <article className="link-card" key={link.id}>
                  <div className="link-content">
                    <a className="short-link" href={shortUrl} target="_blank" rel="noreferrer">
                      {shortUrl || 'Short URL pending'}
                    </a>
                    <p>{link.longUrl}</p>
                    <div className="meta-row">
                      <span>{link.clicks} clicks</span>
                      {link.createdAt && <span>{new Date(link.createdAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="link-actions">
                    <button type="button" className="secondary-button" onClick={() => copyShortUrl(link)}>
                      {copiedId === link.id ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => deleteLink(link)}
                      disabled={deletingId === link.id}
                    >
                      {deletingId === link.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
