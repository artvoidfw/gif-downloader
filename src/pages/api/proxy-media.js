// Proxy API to bypass CORS when downloading/processing external GIFs & Videos

export default async function handler(req, res) {
  const { url, download, filename } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const targetUrl = decodeURIComponent(url).trim();
    const parsedUrl = new URL(targetUrl);

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Invalid URL protocol' });
    }

    const response = await fetch(targetUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: `${parsedUrl.protocol}//${parsedUrl.hostname}/`,
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,video/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Remote server returned ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', contentType);

    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    if (download === '1') {
      const name = filename || 'gifsnap_media.gif';
      res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to proxy media: ' + error.message });
  }
}
