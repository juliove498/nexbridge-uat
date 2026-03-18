export default async function handler(req, res) {
  const { path } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;
  const targetUrl = `https://apitest.nexbridge.io/v1/otc/${apiPath}`;

  // Forward all headers except host
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (key === 'host' || key === 'connection') continue;
    headers[key] = value;
  }
  // Set the origin the API expects
  headers['origin'] = 'https://nexbridge.io';

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Forward response headers
    for (const [key, value] of response.headers.entries()) {
      if (key === 'transfer-encoding') continue;
      res.setHeader(key, value);
    }

    // Allow our own origin
    res.setHeader('access-control-allow-origin', req.headers.origin || '*');
    res.setHeader('access-control-allow-credentials', 'true');
    res.setHeader('access-control-allow-methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('access-control-allow-headers', 'Authorization,Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    const buffer = await response.arrayBuffer();
    return res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    return res.status(502).json({ error: 'Proxy error', message: err.message });
  }
}
