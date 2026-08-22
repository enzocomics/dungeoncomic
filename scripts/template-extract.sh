#!/bin/sh
# Load .env into the current shell
set -a
source ./.env
set +a

npx directus-template-cli@latest extract -p \
	--templateName="DungeonComic Template" \
	--templateLocation="./cms/directus-template" \
	--directusToken=$CMS_ADMIN_TOKEN \
	--directusUrl=$NEXT_PUBLIC_CMS_URL \
	--schema \
	--no-content \
	--flows \
	--dashboards \
	--permissions \
	--no-settings \
	--no-extensions \
	--no-users \
	--no-assets \
	--relation-strategy="preserve"

# FETCH THE CURRENT PRESETS
# - We need to do this because the `directus-template-cli` doesn't extract presets
RESPONSE=$(curl -X GET "$NEXT_PUBLIC_CMS_URL/presets" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN")

# REMOVE THE ADMIN USER UUID
CHANGE_USER=$(echo $RESPONSE |jq 'walk(
  if type == "object" and has("user")
  then .user = "null"
  else .
  end

)' )

# SAVE THE FILE
echo $CHANGE_USER > ./cms/directus-template/src/presets.json
echo "\`directus_presets\` has been extracted successfully."
