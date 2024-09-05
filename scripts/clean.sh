#!/bin/bash
set -euo pipefail

find . -name '.next' -type d -prune -exec rm -rf '{}' +
find . -name '.turbo' -type d -prune -exec rm -rf '{}' +
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
find . -name 'out' -type d -prune -exec rm -rf '{}' +
find . -name 'dist' -type d -prune -exec rm -rf '{}' +
rm pnpm-lock.yaml

