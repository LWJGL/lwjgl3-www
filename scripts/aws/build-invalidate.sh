#!/bin/bash
aws --profile lwjgl cloudfront create-invalidation --distribution-id E2FR9VU2467UNH --paths "/nightly/bin/build.txt" "/release/latest/bin/build.txt"
