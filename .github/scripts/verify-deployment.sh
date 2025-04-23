
#!/bin/bash
# No 'set -e' here, we want to report specific failures

echo "--- Running: verify-deployment.sh ---"

# --- Configuration Variables (Expects these to be exported by the caller) ---
# Required: APP_DIR, MARKER_FILE, ENV_FILE, COMPOSE_FILE, APP_DOMAIN

cd "$APP_DIR" || exit 1

echo "--- Verifying deployment status ---"

if [ ! -f "$MARKER_FILE" ]; then
  echo "❌ Verification Failed: Cannot determine active color. Marker file '$MARKER_FILE' missing."
  exit 1
fi
FINAL_ACTIVE_COLOR=$(cat "$MARKER_FILE")
echo "Verifying active color: $FINAL_ACTIVE_COLOR"

# Check container statuses
echo "Checking container statuses..."
TRAEFIK_STATUS=$(docker ps --filter "name=traefik" --filter "status=running" --format "{{.Names}}")
DB_STATUS=$(docker ps --filter "name=mysql-db" --filter "status=running" --format "{{.Names}}")
ACTIVE_APP_STATUS=$(docker ps --filter "name=node-app-${FINAL_ACTIVE_COLOR}" --filter "status=running" --format "{{.Names}}")

FAIL=0
if [ -z "$TRAEFIK_STATUS" ]; then echo "❌ Traefik container is NOT running!"; FAIL=1; fi
if [ -z "$DB_STATUS" ]; then echo "❌ Database container (mysql-db) is NOT running!"; FAIL=1; fi
if [ -z "$ACTIVE_APP_STATUS" ]; then echo "❌ Active application container (node-app-${FINAL_ACTIVE_COLOR}) is NOT running!"; FAIL=1; fi

if [ "$FAIL" == "1" ]; then
   echo "--- Docker Compose Status ---"
   docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
   echo "--- Logs for failed containers (if any) ---"
   [ -z "$TRAEFIK_STATUS" ] && docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs traefik || true
   [ -z "$DB_STATUS" ] && docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs db || true
   [ -z "$ACTIVE_APP_STATUS" ] && docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs "app_${FINAL_ACTIVE_COLOR}" || true
   exit 1 # Fail the verification step
else
   echo "✅ All essential containers (Traefik, DB, Active App: $FINAL_ACTIVE_COLOR) are running."
fi

# Check endpoint accessibility via curl
echo "Attempting to curl https://${APP_DOMAIN}..."
RETRY_COUNT=0
MAX_RETRIES=3
RETRY_DELAY=10
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  curl -k --fail --silent --show-error --connect-timeout 10 --max-time 20 "https://${APP_DOMAIN}"
  CURL_EXIT_CODE=$?
  if [ $CURL_EXIT_CODE -eq 0 ]; then
    echo "✅ Verification Successful: Endpoint https://${APP_DOMAIN} is reachable and returned HTTP 2xx."
    exit 0 # Success!
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "⚠️ Curl failed (Exit code: $CURL_EXIT_CODE). Retrying in $RETRY_DELAY seconds... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep $RETRY_DELAY
  else
    echo "❌ Verification Failed: Endpoint https://${APP_DOMAIN} is not reachable after $MAX_RETRIES retries (Exit code: $CURL_EXIT_CODE)."
    exit 1 # Fail the verification step
  fi
done

echo "--- Finished: verify-deployment.sh ---"