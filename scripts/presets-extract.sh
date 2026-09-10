#!/bin/sh
# Load .env into the current shell
set -a
source ./.env
set +a

# FETCH THE CURRENT PRESETS
# - We need to do this because the `directus-template-cli` doesn't extract presets
GET_PRESETS=$(curl -X GET "$NEXT_PUBLIC_CMS_URL/presets" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN")

# REMOVE THE ADMIN USER UUID FROM THE PRESETS FILE
REMOVE_ADMIN_UUID_FROM_PRESETS=$(echo $GET_PRESETS |jq 'walk(
  if type == "object" and has("user")
  then .user = "null"
  else .
  end

)' )

# SAVE THE FILE
echo $REMOVE_ADMIN_UUID_FROM_PRESETS > ./cms/directus-template/src/presets.json
echo "\`directus_presets\` has been extracted successfully."
