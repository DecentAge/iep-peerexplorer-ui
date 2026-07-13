#!/bin/sh
set -eu

TEMPLATE=/etc/nginx/templates/env.config.js.template
TARGET=/usr/share/nginx/html/env.config.js

echo "Generating ${TARGET} from ${TEMPLATE} (NETWORK_ENVIRONMENT=${NETWORK_ENVIRONMENT:-})"
envsubst '${NETWORK_ENVIRONMENT}' < "$TEMPLATE" > "$TARGET"

echo "generated the following environment config:"
cat "$TARGET"
