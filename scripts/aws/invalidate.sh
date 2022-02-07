#!/bin/bash

DISTRIBUTION_ID="EAGA7RQ3R06GH"
INVALIDATION_ID=$(aws --profile lwjgl cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" | jq -r ".Invalidation.Id")
watch -c -d "aws --profile lwjgl cloudfront get-invalidation --distribution-id $DISTRIBUTION_ID --id $INVALIDATION_ID | jq -C -r \".Invalidation\""
