## Update production website

NOTE: Requires access to AWS resources

```bash
# Replace ECS tasks with latest container image
./aws/update.sh
# After the above has run, create a Cloudfront invalidation request (flushes CDN cache)
./aws/invalidate.sh
# or
node ./scripts/flush.mjs www
```

## Icon Generation

```bash
mkdir scripts/icons
cd scripts
ln -s {{src}}/Font-Awesome/svgs ./icons/fa
node icons
```
