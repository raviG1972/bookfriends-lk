#!/bin/bash
# Keep-alive script for the dev server
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting dev server..." >> /home/z/my-project/dev.log
  node node_modules/.bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 2s..." >> /home/z/my-project/dev.log
  sleep 2
done