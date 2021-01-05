#!/bin/bash

aws cloudfront create-invalidation \
  --distribution-id ENXBPW89N98ZQ \
  --paths "/*"
