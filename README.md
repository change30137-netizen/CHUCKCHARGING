# CHUCKCHARGING

EV Charging Project Map

## Ragic security

The map frontend no longer calls Ragic directly with an API key.

- Frontend data requests now go through a proxy endpoint: `window.__ragic_proxy_url || '/api/ragic'`
- A deployable Cloudflare Worker example lives in [`cloudflare/ragic-proxy.js`](cloudflare/ragic-proxy.js)
- Put the Ragic key in the Worker secret `RAGIC_API_KEY`, not in `index.html`

Google Maps still runs in the browser, so that key should be restricted with HTTP referrer rules in Google Cloud Console.
