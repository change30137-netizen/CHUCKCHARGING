# Cloudflare Worker Proxy

This Worker keeps the Ragic API key off the frontend.

## Setup

1. Install Wrangler: `npm install -g wrangler`
2. Copy `wrangler.toml.example` to `wrangler.toml`
3. Update `ALLOWED_ORIGIN` to your site origin
4. Add the secret: `wrangler secret put RAGIC_API_KEY`
5. Deploy: `wrangler deploy`

## Frontend configuration

The frontend now reads from `window.__ragic_proxy_url || '/api/ragic'`.

- If the Worker is mounted on the same domain, route `/api/ragic*` to it.
- If the Worker uses another domain, set `window.__ragic_proxy_url` before the map script runs.

Example:

```html
<script>
  window.__ragic_proxy_url = 'https://your-worker.example.workers.dev';
</script>
```

The frontend will call:

- `GET /api/ragic?form=7`
- `GET /api/ragic?form=23`
