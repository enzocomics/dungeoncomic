#!/bin/bash
# build Directus & its dependencies first
docker compose up cms -d --build

# wait for health status
while true; do
  status="$(docker inspect --format='{{.State.Health.Status}}' dungeoncomic_cms 2>/dev/null || echo "")"
  [ "$status" = "healthy" ] && break
  echo "Waiting for health... current: $status"
  sleep 2
done

# Once Directus is up and running, apply the template & the defaults
./scripts/template-apply.sh
./scripts/set-defaults.sh

#!/bin/bash
# After that, we can build the Next.js frontend
docker compose up frontend -d --build