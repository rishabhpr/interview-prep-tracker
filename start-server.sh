#!/bin/bash
# Start the interview prep tracker server
cd "$(dirname "$0")"
exec node node_modules/serve/build/main.js dist -l 3456
