#!/bin/bash
aws cloudfront create-invalidation --distribution-id E23P50F0J5ZE30 --paths "/nightly/bin/build.txt" "/release/latest/bin/build.txt"
