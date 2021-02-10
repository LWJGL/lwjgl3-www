#!/bin/bash

CLUSTER_ID="arn:aws:ecs:us-east-1:668135804372:cluster/webhotelier"
SERVICE_ID="arn:aws:ecs:us-east-1:668135804372:service/webhotelier/lwjgl-www"

aws ecs update-service --cluster "$CLUSTER_ID" --service "$SERVICE_ID" --force-new-deployment
watch -c "aws ecs describe-services --cluster \"$CLUSTER_ID\" --services \"$SERVICE_ID\" | jq -C -r '.services[0] | { lastEvent: .events[0], deployments: .deployments }'"
