#!/bin/bash
set -e 

echo "--- Running: 04-cleanup.sh ---"

cd "$APP_DIR" || exit 1

echo "--- 8. (Optional) Stopping Old Inactive Container ($ACTIVE_COLOR) ---"
echo "Stopping the previous active container (now inactive): node-app-${ACTIVE_COLOR}..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" stop "app_${ACTIVE_COLOR}" || echo "Container app_${ACTIVE_COLOR} already stopped or could not be stopped."

echo "--- 9. Cleaning up unused Docker images ---"
docker image prune -a -f --filter "label!=maintainer=Traefik" || echo "Docker prune failed (might need sudo or permissions)."

echo "--- Finished: 04-cleanup.sh ---"