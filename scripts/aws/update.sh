#!/bin/bash

CLUSTER_ID="arn:aws:ecs:us-east-1:770058214810:cluster/lwjgl-cluster"
SERVICE_ID="arn:aws:ecs:us-east-1:770058214810:service/lwjgl-cluster/lwjgl-www"

aws --profile lwjgl ecs update-service --cluster "$CLUSTER_ID" --service "$SERVICE_ID" --force-new-deployment
watch -c "aws --profile lwjgl ecs describe-services --cluster \"$CLUSTER_ID\" --services \"$SERVICE_ID\" | jq -C -r '.services[0] | { lastEvent: .events[0], deployments: .deployments }'"
