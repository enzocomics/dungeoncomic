#!/bin/sh
# Load .env into the current shell
set -a
source ./.env
set +a

COLLECTION="settings"
PAYLOAD='{"project_name": "Dungeon Construction Co.", "project_url": "'"${NEXT_PUBLIC_CMS_URL}"'", "public_registration": "true", "public_registration_role": "5ad2a6f5-74a6-4ebc-9864-5e7b451203d2"  }'

# Update our project `settings` collection 
curl -X PATCH "$NEXT_PUBLIC_CMS_URL/items/$COLLECTION" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"

	# Update default `directus_settings` collection 
curl -X PATCH "$NEXT_PUBLIC_CMS_URL/settings" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"