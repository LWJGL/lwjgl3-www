# Instructions

https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker

# Build

```bash
# update to latest node
docker pull node:slim
# build
docker build --rm -t headless-chrome .
# force rebuild
docker build --rm --no-cache -t headless-chrome .
```

# Run

```bash
# ./run.sh
docker run --rm -d --name chrome -p 9222:9222 headless-chrome
# test with
curl http://localhost:9222/json/version
```
