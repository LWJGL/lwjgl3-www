# Cloudfront Function

This function performs the following functions:

- Redirects `lwjgl.org` to `www.lwjgl.org`
- Redirects legacy `lwjgl.org` URLs (e.g. `/license.php` to `/license`)
- Normalizes and optimizes headers that are used as cache keys by the CDN (Cloudfront)

Event structure: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-event-structure.html
Runtime features: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html

## Quotas:

```
Mem: <=2MB
Code Size: <=10KB
Exec Time: <=1ms
```

## Create function

```bash
aws cloudfront create-function \
--name lwjgl-viewer-request \
--function-config Comment="Function that redirects and normalizes LWJGL requests",Runtime=cloudfront-js-1.0 \
--function-code fileb://index.js
```

## Retrieve ETag

```bash
ETAG=$(aws cloudfront describe-function --name lwjgl-viewer-request | jq .ETag --raw-output)
```

## Update function

Note: ETag is updated after each change, make re-run above command

```bash
aws cloudfront update-function \
--name lwjgl-viewer-request \
--if-match $ETAG \
--function-config Comment="Function that redirects and normalizes LWJGL requests",Runtime=cloudfront-js-1.0 \
--function-code fileb://index.js
```

## Test

```bash
aws cloudfront test-function --name lwjgl-viewer-request --if-match $ETAG --event-object fileb://tests/host-redirect.json | jq '.TestResult.FunctionOutput | fromjson'
aws cloudfront test-function --name lwjgl-viewer-request --if-match $ETAG --event-object fileb://tests/legacy-redirect.json | jq '.TestResult.FunctionOutput | fromjson'
aws cloudfront test-function --name lwjgl-viewer-request --if-match $ETAG --event-object fileb://tests/optimize-headers.json | jq '.TestResult.FunctionOutput | fromjson'
aws cloudfront test-function --name lwjgl-viewer-request --if-match $ETAG --event-object fileb://tests/query-normalize.json | jq '.TestResult.FunctionOutput | fromjson'
```

## Publish function

```bash
aws cloudfront publish-function --name lwjgl-viewer-request --if-match $ETAG
```
