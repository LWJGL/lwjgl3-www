#!/bin/bash

# https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md
google-chrome-unstable \
  --headless \
	--no-sandbox \
  --enable-automation \
  --in-process-gpu \
  --single-process \
  --disable-dev-shm-usage \
  --disable-client-side-phishing-detection \
	--disable-default-apps \
	--disable-extensions \
  --disable-component-extensions-with-background-pages \
	--mute-audio \
	--no-first-run \
  --disable-background-timer-throttling \
  --disable-backgrounding-occluded-windows \
  --disable-features=ScriptStreaming \
  --disable-hang-monitor \
  --disable-ipc-flooding-protection \
  --disable-notifications \
  --disable-prompt-on-repost \
  --disable-renderer-backgrounding \
  --disable-device-discovery-notifications \
  --enable-logging=stderr \
  --log-level=0 \
  --password-store=basic \
  --silent-debugger-extension-api \
	--disable-background-networking \
	--disable-breakpad \
	--disable-component-update \
	--disable-domain-reliability \
	--disable-sync \
	--disable-translate \
	--metrics-recording-only \
  --disable-features=PaintHolding \
  --disable-partial-raster \
  --disable-skia-runtime-opts \
  --disable-features=site-per-process \
	--hide-scrollbars \
	--safebrowsing-disable-auto-update \
	--ignore-certificate-errors \
	--ignore-ssl-errors \
	--ignore-certificate-errors-spki-list \
	--user-data-dir=/tmp \
	--remote-debugging-port=9222 \
	--remote-debugging-address=0.0.0.0

# --disable-gpu \
# --deterministic-mode \
# --remote-debugging-pipe \
# --allow-running-insecure-content \
# --autoplay-policy=user-gesture-required \
# --disable-popup-blocking \
# --js-flags=--random-seed=1157259157
# --block-new-web-contents \
# --force-color-profile=srgb \
# --force-device-scale-factor=1 \
