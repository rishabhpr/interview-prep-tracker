#!/bin/bash
cd "$(dirname "$0")"
while true; do
  node server.cjs
  echo "Server crashed, restarting in 2s..."
  sleep 2
done
