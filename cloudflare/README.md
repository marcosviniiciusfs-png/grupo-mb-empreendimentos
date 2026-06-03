# Meta CAPI Cloudflare Worker

This Worker receives the lead payload from the simulator and sends the server-side
`Lead` event to Meta Conversions API.

Required secret:

```bash
wrangler secret put META_CAPI_ACCESS_TOKEN
```

Optional variables:

```bash
META_PIXEL_ID=2864957293877250
META_GRAPH_API_VERSION=v25.0
META_TEST_EVENT_CODE=<Meta test event code>
```

After deploying the Worker, set the site build variable:

```bash
VITE_META_CAPI_ENDPOINT=https://<your-worker-url>
```

Deploy from this folder:

```bash
wrangler deploy
```
