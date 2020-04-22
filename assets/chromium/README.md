# Instructions

https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker

# Build

```bash
docker build --rm -t headless-chrome .
```

# Run

```bash
# ./run.sh
docker run --rm -d --name chrome -p 9222:9222 headless-chrome
# test with
curl http://localhost:9222/json/version
```
