# Lambda@Edge Cloudfront Viewer Request handler

This λ function performs the following functions:

- Redirects `lwjgl.org` to `www.lwjgl.org`
- Redirects legacy `lwjgl.org` URLs (e.g. `/license.php` to `/license` )
- Normalizes and optimizes headers that are used as cache keys by the CDN (Cloudfront)

## Test

```bash
ts-node test/host-redirect
ts-node test/legacy-redirect
ts-node test/optimize-headers
```
