#!/bin/bash
docker run --rm -d --init --cap-add=SYS_ADMIN --name chrome -p 9222:9222 headless-chrome
