#!/bin/bash

aws ecs update-service \
  --cluster "arn:aws:ecs:us-east-1:668135804372:cluster/webhotelier" \
  --service "arn:aws:ecs:us-east-1:668135804372:service/webhotelier/lwjgl-www" \
  --force-new-deployment
