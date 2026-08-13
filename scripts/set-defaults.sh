#!/bin/sh
# Load .env into the current shell
set -a
source ./.env
set +a

# Upload the default logo mark
RESPONSE=$(curl -X POST "$NEXT_PUBLIC_CMS_URL/files" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -F "file=@./scripts/dungeoncomic-mark.svg")

# Use sed to extract the UUID
# This looks for "id":" followed by any characters until the next double quote
LOGO_UUID=$(echo "$RESPONSE" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

# Set up the payload for the PROJECT settings
PROJECT_SETTINGS_PAYLOAD="{\"project_name\": \"Dungeon Construction Co.\", \"project_url\": \"$NEXT_PUBLIC_SITE_URL\"}"

# Set up the payload for DIRECTUS settings
# TODO: public registration role should not be hardcoded
DIRECTUS_SETTINGS_PAYLOAD="{\"project_name\": \"Dungeon Construction Co.\", \"project_url\": \"$NEXT_PUBLIC_SITE_URL\", \"project_color\": \"#7c7c67\", \"project_logo\": \"$LOGO_UUID\", \"public_registration\": \"true\", \"public_registration_role\": \"5ad2a6f5-74a6-4ebc-9864-5e7b451203d2\" }"

# Update our project `settings` collection 
curl -X PATCH "$NEXT_PUBLIC_CMS_URL/items/settings" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PROJECT_SETTINGS_PAYLOAD"

# Update default `directus_settings` collection 
curl -X PATCH "$NEXT_PUBLIC_CMS_URL/settings" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$DIRECTUS_SETTINGS_PAYLOAD"