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
	--no-dashboards \
	--permissions \
	--no-settings \
	--no-extensions \
	--no-users \
	--no-assets