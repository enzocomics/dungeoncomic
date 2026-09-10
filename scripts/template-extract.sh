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

########################################
# REPLACE DIRECTUS GENERATED ROLE/POLICY UUIDS WITH PLACEHOLDERS
SAVED_POLICIES_FILE="./cms/directus-template/src/policies.json"
SAVED_ACCESS_FILE="./cms/directus-template/src/access.json"
SAVED_PERMISSIONS_FILE="./cms/directus-template/src/permissions.json"

TMP_POLICIES_FILE=$(mktemp)
TMP_ACCESS_FILE=$(mktemp)
TMP_PERMISSIONS_FILE=$(mktemp)

# CHECK THE CURRENT PUBLIC POLICY UUID
GET_PUBLIC_ACCESS_ITEM=$(curl -g -X GET "$NEXT_PUBLIC_CMS_URL/access?filter[role][_eq]=null" \
	-H "Authorization: Bearer $CMS_ADMIN_TOKEN")

PUBLIC_POLICY_UUID=$(echo $GET_PUBLIC_ACCESS_ITEM | jq -r '.data[0].policy')

# REPLACE IT WITH A PLACEHOLDER IN THE POLICIES FILE
jq --arg PUBLIC_POLICY_UUID "$PUBLIC_POLICY_UUID" '
  walk(if type == "object" and .id == $PUBLIC_POLICY_UUID
       then .id = "PUBLIC_POLICY_UUID_PLACEHOLDER"
       else .
       end)
' "$SAVED_POLICIES_FILE" > "$TMP_POLICIES_FILE" && mv "$TMP_POLICIES_FILE" "$SAVED_POLICIES_FILE"

# REPLACE IT WITH A PLACEHOLDER IN THE ACCESS FILE
jq --arg PUBLIC_POLICY_UUID "$PUBLIC_POLICY_UUID" '
  walk(if type == "object" and .policy == $PUBLIC_POLICY_UUID
       then .policy = "PUBLIC_POLICY_UUID_PLACEHOLDER"
			 | .id = "PUBLIC_ACCESS_ITEM_ID_PLACEHOLDER"
       else .
       end)
' "$SAVED_ACCESS_FILE" > "$TMP_ACCESS_FILE" && mv "$TMP_ACCESS_FILE" "$SAVED_ACCESS_FILE"

# REPLACE IT WITH A PLACEHOLDER IN THE PERMISSIONS FILE
jq --arg PUBLIC_POLICY_UUID "$PUBLIC_POLICY_UUID" '
  walk(if type == "object" and .policy == $PUBLIC_POLICY_UUID
       then .policy = "PUBLIC_POLICY_UUID_PLACEHOLDER"
       else .
       end)
' "$SAVED_PERMISSIONS_FILE" > "$TMP_PERMISSIONS_FILE" && mv "$TMP_PERMISSIONS_FILE" "$SAVED_PERMISSIONS_FILE"


##################### DO IT ALL AGAIN FOR THE ADMIN ROLE
# Get the UUID of the CURRENT administrator role
GET_ADMIN_ROLE_UUID=$(curl -g -X GET "$NEXT_PUBLIC_CMS_URL/roles?filter[name][_eq]=Administrator" \
	-H "Authorization: Bearer $CMS_ADMIN_TOKEN")

ADMIN_ROLE_UUID=$(echo $GET_ADMIN_ROLE_UUID | jq -r '.data[0].id')
# echo "adminRoleID = $ADMIN_ROLE_UUID"

# With the CURRENT ADMIN ROLE UUID, determine the attached POLICY UUID by looking through the ACCESS rules junction collection
GET_ADMIN_ACCESS_ITEM=$(curl -g -X GET "$NEXT_PUBLIC_CMS_URL/access?filter[role][_eq]=$ADMIN_ROLE_UUID" \
	-H "Authorization: Bearer $CMS_ADMIN_TOKEN")

ADMIN_POLICY_UUID=$(echo $GET_ADMIN_ACCESS_ITEM | jq -r '.data[0].policy')
#  echo "adminPolicyID = $ADMIN_POLICY_UUID"

# REPLACE IT WITH A PLACEHOLDER IN THE POLICIES FILE
jq --arg ADMIN_POLICY_UUID "$ADMIN_POLICY_UUID" '
  walk(if type == "object" and .id == $ADMIN_POLICY_UUID
       then .id = "ADMIN_POLICY_UUID_PLACEHOLDER"
       else .
       end)
' "$SAVED_POLICIES_FILE" > "$TMP_POLICIES_FILE" && mv "$TMP_POLICIES_FILE" "$SAVED_POLICIES_FILE"

# REPLACE IT WITH A PLACEHOLDER IN THE ACCESS FILE
jq --arg ADMIN_POLICY_UUID "$ADMIN_POLICY_UUID" '
  walk(if type == "object" and .policy == $ADMIN_POLICY_UUID
       then .policy = "ADMIN_POLICY_UUID_PLACEHOLDER"
			 | .role = "ADMIN_ROLE_UUID_PLACEHOLDER"
			 | .id = "ADMIN_ACCESS_ITEM_ID_PLACEHOLDER"
       else .
       end)
' "$SAVED_ACCESS_FILE" > "$TMP_ACCESS_FILE" && mv "$TMP_ACCESS_FILE" "$SAVED_ACCESS_FILE"

# DELETE THE AUTOMATICALLY EXTRACTED ADMINISTRATOR ROLE
# Directus should always have one generated and ready to go anyway.
SAVED_ROLES_FILE="./cms/directus-template/src/roles.json"
TMP_ROLES_FILE=$(mktemp)

jq --arg ADMIN_ROLE_UUID "$ADMIN_ROLE_UUID" '
walk (
	if type == "object" and .id == $ADMIN_ROLE_UUID
	and .name == "Administrator"
	then empty
	else .
	end
)
' "$SAVED_ROLES_FILE" > "$TMP_ROLES_FILE" && mv "$TMP_ROLES_FILE" "$SAVED_ROLES_FILE"
