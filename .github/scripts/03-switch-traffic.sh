#!/bin/bash
set -e 

echo "--- Running: 03-switch-traffic.sh ---"

cd "$APP_DIR" || exit 1

echo "--- 7. Switching Traffic to New Version ($INACTIVE_COLOR) ---"
echo "Updating .env file to swap priorities..."
if [ "$INACTIVE_COLOR" == "blue" ]; then
   sed -i "s/BLUE_PRIORITY=.*/BLUE_PRIORITY=$ACTIVE_PRIORITY/" "$ENV_FILE"
   sed -i "s/GREEN_PRIORITY=.*/GREEN_PRIORITY=$INACTIVE_PRIORITY/" "$ENV_FILE"
else
   sed -i "s/BLUE_PRIORITY=.*/BLUE_PRIORITY=$INACTIVE_PRIORITY/" "$ENV_FILE"
   sed -i "s/GREEN_PRIORITY=.*/GREEN_PRIORITY=$ACTIVE_PRIORITY/" "$ENV_FILE"
fi
echo ".env updated. New active priority for $INACTIVE_COLOR is $ACTIVE_PRIORITY."

echo "Applying routing changes via docker compose up (using existing images)..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --remove-orphans --no-build --no-deps "app_blue" "app_green"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-build --no-deps traefik

echo "$INACTIVE_COLOR" > "$MARKER_FILE"

echo "--- Traffic Switched. New Active Color is now: $INACTIVE_COLOR ---"

echo "Waiting 10 seconds for Traefik to apply new routing rules..."
sleep 10

echo "--- Finished: 03-switch-traffic.sh ---"