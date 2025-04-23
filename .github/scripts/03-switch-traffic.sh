#!/bin/bash
set -e # Exit script immediately if any command fails

echo "--- Running: 03-switch-traffic.sh ---"

# --- Configuration Variables (Expects these to be exported by the caller) ---
# Required: APP_DIR, ENV_FILE, COMPOSE_FILE, MARKER_FILE, INACTIVE_COLOR, ACTIVE_PRIORITY, INACTIVE_PRIORITY

cd "$APP_DIR" || exit 1

echo "--- 7. Switching Traffic to New Version ($INACTIVE_COLOR) ---"
echo "Updating .env file to swap priorities..."
if [ "$INACTIVE_COLOR" == "blue" ]; then
   # Make blue ACTIVE (high priority), green INACTIVE (low priority)
   sed -i "s/BLUE_PRIORITY=.*/BLUE_PRIORITY=$ACTIVE_PRIORITY/" "$ENV_FILE"
   sed -i "s/GREEN_PRIORITY=.*/GREEN_PRIORITY=$INACTIVE_PRIORITY/" "$ENV_FILE"
else
   # Make green ACTIVE (high priority), blue INACTIVE (low priority)
   sed -i "s/BLUE_PRIORITY=.*/BLUE_PRIORITY=$INACTIVE_PRIORITY/" "$ENV_FILE"
   sed -i "s/GREEN_PRIORITY=.*/GREEN_PRIORITY=$ACTIVE_PRIORITY/" "$ENV_FILE"
fi
echo ".env updated. New active priority for $INACTIVE_COLOR is $ACTIVE_PRIORITY."

echo "Applying routing changes via docker compose up (using existing images)..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --remove-orphans --no-build --no-deps "app_blue" "app_green"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-build --no-deps traefik

# Update the marker file to reflect the new active color
echo "$INACTIVE_COLOR" > "$MARKER_FILE"

echo "--- Traffic Switched. New Active Color is now: $INACTIVE_COLOR ---"

echo "Waiting 10 seconds for Traefik to apply new routing rules..."
sleep 10

echo "--- Finished: 03-switch-traffic.sh ---"