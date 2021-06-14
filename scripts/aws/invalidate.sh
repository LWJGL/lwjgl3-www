#!/bin/bash

DISTRIBUTION_ID="ENXBPW89N98ZQ"
INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" | jq -r ".Invalidation.Id")
watch -c -d "aws cloudfront get-invalidation --distribution-id $DISTRIBUTION_ID --id $INVALIDATION_ID | jq -C -r \".Invalidation\""
