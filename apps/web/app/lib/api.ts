export async function createShortUrl(originalUrl: string, shortCode?: string) {
  const response = await fetch('/api/urls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ originalUrl, shortCode }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create URL' }));
    throw new Error(error.error || 'Failed to create URL');
  }

  return response.json();
}

export async function getUserUrls() {
  const response = await fetch('/api/urls', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch URLs');
  }

  return response.json();
}
