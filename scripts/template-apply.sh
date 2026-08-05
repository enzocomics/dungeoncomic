#!/bin/sh
# Load .env into the current shell
set -a
source ./.env
set +a

npx directus-template-cli@latest apply -p \
	--directusUrl=$NEXT_PUBLIC_CMS_URL \
	--directusToken=$CMS_ADMIN_TOKEN \
	--templateLocation="./cms/directus-template" \
	--templateType="local" \
	--schema \
	--no-content \
	--flows \
	--no-dashboards \
	--permissions \
	--no-settings \
	--no-extensions \
	--no-users \
	--no-assets