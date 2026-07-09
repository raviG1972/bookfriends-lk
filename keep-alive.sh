#!/bin/bash
while true; do
  if ! pgrep -f "next dev" > /dev/null 2>&1; then
    echo "[$(date)] Restarting dev server..." >> /home/z/my-project/dev.log
    node node_modules/.bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
    disown
  fi
  sleep 5
done
