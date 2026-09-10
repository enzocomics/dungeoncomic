#!/bin/sh
# Load .env into the current shell
set -a
source ./.env
set +a

# Retrieve the UUID of the initial admin user
GET_ADMIN_UUID=$(curl -g -X GET "$NEXT_PUBLIC_CMS_URL/users?filter[role][name][_eq]=Administrator" \
	-H "Authorization: Bearer $CMS_ADMIN_TOKEN")
ADMIN_UUID=$(echo "$GET_ADMIN_UUID" | jq -r '.data[0].id')

##------------------------------------------------------##
# Apply our extracted Directus Presets to the current Admin User
PRESETS="$(<./cms/directus-template/src/presets.json)"

# Change the user UUID to the current admin user
DIRECTUS_PRESETS_PAYLOAD=$(echo $PRESETS |jq --arg admin_uuid "$ADMIN_UUID" 'walk(
  if type == "object" and has("user")
  then .user = $admin_uuid
  else .
  end
)' )

# Update default `directus_presets` collection 
curl -X POST "$NEXT_PUBLIC_CMS_URL/presets" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$DIRECTUS_PRESETS_PAYLOAD"


echo "\`directus_presets\` have been applied successfully."