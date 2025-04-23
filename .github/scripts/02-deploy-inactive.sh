#!/bin/bash
set -e # Exit script immediately if any command fails

echo "--- Running: 02-deploy-inactive.sh ---"

# --- Configuration Variables (Expects these to be exported by the caller) ---
# Required: APP_DIR, ENV_FILE, COMPOSE_FILE, INACTIVE_COLOR, APP_PORT

cd "$APP_DIR" || exit 1

echo "--- 5. Building Images and Starting Inactive Container ($INACTIVE_COLOR) ---"
echo "Pulling base images (traefik, db)..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" pull traefik db

echo "Building images for both app_blue and app_green..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build app_blue app_green

echo "Starting inactive service: app_$INACTIVE_COLOR"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --remove-orphans --no-deps "app_${INACTIVE_COLOR}"

echo "Ensuring traefik and db services are up..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d traefik db

echo "Waiting 15 seconds for $INACTIVE_COLOR container to stabilize..."
sleep 15

echo "--- 6. Health Check for Inactive Container ($INACTIVE_COLOR) ---"
if docker ps --filter "name=node-app-${INACTIVE_COLOR}" --filter "status=running" | grep -q "node-app-${INACTIVE_COLOR}"; then
  echo "✅ Basic Health Check: Container node-app-${INACTIVE_COLOR} is running."
  # ADD MORE SPECIFIC HEALTH CHECKS HERE (e.g., curl internal endpoint)
else
  echo "❌ Basic Health Check Failed: Container node-app-${INACTIVE_COLOR} did not start correctly!"
  echo "--- Logs for node-app-${INACTIVE_COLOR} ---"
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs "app_${INACTIVE_COLOR}" || echo "Could not get logs."
  exit 1 # Fail the deployment
fi

echo "--- Finished: 02-deploy-inactive.sh ---"