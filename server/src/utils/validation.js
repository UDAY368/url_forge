const slugPattern = /^[a-zA-Z0-9_-]{3,32}$/;

export function validateCreateUrlPayload(body) {
  if (!body || typeof body !== 'object') {
    return invalid('Request body must be a JSON object.');
  }

  const url = normalizeString(body.url || body.longUrl);
  const customSlug = normalizeString(body.customSlug);

  if (!url) {
    return invalid('URL is required.');
  }

  if (!isValidHttpUrl(url)) {
    return invalid('URL must be a valid http or https URL.');
  }

  if (customSlug) {
    const slugResult = validateSlug(customSlug);

    if (!slugResult.valid) {
      return slugResult;
    }
  }

  return {
    valid: true,
    url,
    customSlug: customSlug || null
  };
}

export function validateSlug(slug) {
  if (!normalizeString(slug)) {
    return invalid('Slug is required.');
  }

  if (!slugPattern.test(slug)) {
    return invalid('Slug must be 3-32 characters and contain only letters, numbers, underscores, or hyphens.');
  }

  return { valid: true };
}

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function invalid(error) {
  return {
    valid: false,
    error
  };
}
