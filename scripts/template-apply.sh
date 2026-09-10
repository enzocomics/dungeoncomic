#!/bin/sh
# Load .env into the current shell
set -a
source ./.env
set +a

#########################################################
#
# On initial install, Directus automatically generates
# an administrator role + policy, and a public policy.
# We have to make sure that the new generated IDs are 
# applied to the access items & policies we have saved
# in DungeonComic's Directus Template
#

# Get the UUID of the CURRENT administrator role
GET_ADMIN_ROLE_UUID=$(curl -g -X GET "$NEXT_PUBLIC_CMS_URL/roles?filter[name][_eq]=Administrator" \
	-H "Authorization: Bearer $CMS_ADMIN_TOKEN")

ADMIN_ROLE_UUID=$(echo $GET_ADMIN_ROLE_UUID | jq -r '.data[0].id')
# echo "adminRoleID = $ADMIN_ROLE_UUID"


# With the CURRENT ADMIN ROLE UUID, determine the attached POLICY UUID by looking through the ACCESS rules junction collection
GET_ADMIN_ACCESS_ITEM=$(curl -g -X GET "$NEXT_PUBLIC_CMS_URL/access?filter[role][_eq]=$ADMIN_ROLE_UUID" \
	-H "Authorization: Bearer $CMS_ADMIN_TOKEN")

ADMIN_ACCESS_ITEM_ID=$(echo $GET_ADMIN_ACCESS_ITEM | jq -r '.data[0].id')
ADMIN_POLICY_UUID=$(echo $GET_ADMIN_ACCESS_ITEM | jq -r '.data[0].policy')
#  echo "adminPolicyID = $ADMIN_POLICY_UUID"

# Now, we have to look through `policies.json` and REPLACE the SAVED administrator policy UUID with the CURRENT one 
SAVED_POLICIES_FILE="./cms/directus-template/src/policies.json"
OLD_POLICIES_FILE="./cms/directus-template/src/policies-old.json"
cp -- "$SAVED_POLICIES_FILE" "$OLD_POLICIES_FILE"

# We'll need the old uuid for reference
SAVED_ADMIN_POLICY_UUID=$(
  jq -r '
    first(.. | objects | select(.name == "Administrator") | .id)
  ' "$SAVED_POLICIES_FILE"
)
# echo "oldAdminPolicyID = $SAVED_ADMIN_POLICY_UUID"

TMP_FILE=$(mktemp)

jq --arg new_id "$ADMIN_POLICY_UUID" '
  walk(if type == "object" and .name == "Administrator"
       then .id = $new_id
       else .
       end)
' "$SAVED_POLICIES_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$SAVED_POLICIES_FILE"

# We also have to update the `access.json` junction collection, using the old UUID for reference
SAVED_ACCESS_FILE="./cms/directus-template/src/access.json"
OLD_ACCESS_FILE="./cms/directus-template/src/access-old.json"
cp -- "$SAVED_ACCESS_FILE" "$OLD_ACCESS_FILE"

tmp=$(mktemp)

jq --arg new_id "$ADMIN_POLICY_UUID" --arg old_id "$SAVED_ADMIN_POLICY_UUID" --arg new_role_uuid "$ADMIN_ROLE_UUID" --arg new_access_item_id "$ADMIN_ACCESS_ITEM_ID" '
  walk(if type == "object" and .policy == $old_id
       then .policy = $new_id
			 | .role = $new_role_uuid
			 | .id = $new_access_item_id
       else .
       end)
' "$SAVED_ACCESS_FILE" > "$tmp" && mv "$tmp" "$SAVED_ACCESS_FILE"

#########################################################
# Now we have to do ALL that shit for the guest policy as well
# The default guest policy should have no role assigned

GET_PUBLIC_ACCESS_ITEM=$(curl -g -X GET "$NEXT_PUBLIC_CMS_URL/access?filter[role][_eq]=null" \
	-H "Authorization: Bearer $CMS_ADMIN_TOKEN")

PUBLIC_ACCESS_ITEM_ID=$(echo $GET_PUBLIC_ACCESS_ITEM | jq -r '.data[0].id')
PUBLIC_POLICY_UUID=$(echo $GET_PUBLIC_ACCESS_ITEM | jq -r '.data[0].policy')
# echo "publicPolicyID = $PUBLIC_POLICY_UUID"

# Now, AGAIN, we have to look through `policies.json` and REPLACE the SAVED PUBLIC policy UUID with the CURRENT one 
SAVED_POLICIES_FILE2="./cms/directus-template/src/policies.json"

# We'll need the old uuid for reference
SAVED_PUBLIC_POLICY_UUID=$(
  jq -r '
    first(.. | objects | select(.name == "$t:public_label") | .id)
  ' "$SAVED_POLICIES_FILE2"
)
# echo "oldAdminPolicyID = $SAVED_PUBLIC_POLICY_UUID"

TMP_FILE=$(mktemp)

jq --arg new_id "$PUBLIC_POLICY_UUID" '
  walk(if type == "object" and .name == "$t:public_label"
       then .id = $new_id
       else .
       end)
' "$SAVED_POLICIES_FILE2" > "$TMP_FILE" && mv "$TMP_FILE" "$SAVED_POLICIES_FILE2"

# We also have to update the `access.json` junction collection, using the old UUID for reference
SAVED_ACCESS_FILE2="./cms/directus-template/src/access.json"

tmp=$(mktemp)

jq --arg new_id "$PUBLIC_POLICY_UUID" --arg old_id "$SAVED_PUBLIC_POLICY_UUID" --arg new_public_access_item_id "$PUBLIC_ACCESS_ITEM_ID" '
  walk(if type == "object" and .policy == $old_id
       then .policy = $new_id
			 | .id = $new_public_access_item_id
       else .
       end)
' "$SAVED_ACCESS_FILE2" > "$tmp" && mv "$tmp" "$SAVED_ACCESS_FILE2"

# Additionally, we need to update the public permissions `permissions.json` to the new uuid
SAVED_PERMISSIONS_FILE="./cms/directus-template/src/permissions.json"
OLD_PERMISSIONS_FILE="./cms/directus-template/src/permissions-old.json"
cp -- "$SAVED_PERMISSIONS_FILE" "$OLD_PERMISSIONS_FILE"

TMP_FILE=$(mktemp)

jq --arg new_id "$PUBLIC_POLICY_UUID" --arg old_id "$SAVED_PUBLIC_POLICY_UUID" '
  walk(if type == "object" and .policy == $old_id
       then .policy = $new_id
       else .
       end)
' "$SAVED_PERMISSIONS_FILE" > "$tmp" && mv "$tmp" "$SAVED_PERMISSIONS_FILE"

# Apply the Directus Template
# npx directus-template-cli@latest apply -p \
# 	--directusUrl=$NEXT_PUBLIC_CMS_URL \
# 	--directusToken=$CMS_ADMIN_TOKEN \
# 	--templateLocation="./cms/directus-template" \
# 	--templateType="local" \
# 	--schema \
# 	--no-content \
# 	--flows \
# 	--no-dashboards \
# 	--permissions \
# 	--no-settings \
# 	--no-extensions \
# 	--no-users \
# 	--no-assets

# CLEANUP -- restore the original files (with placeholders) after the template has been extracted
cp -- "$OLD_ACCESS_FILE" "$SAVED_ACCESS_FILE"
cp -- "$OLD_POLICIES_FILE" "$SAVED_POLICIES_FILE" 
cp -- "$OLD_PERMISSIONS_FILE" "$SAVED_PERMISSIONS_FILE" 
rm -f -- "$OLD_ACCESS_FILE"
rm -f -- "$OLD_POLICIES_FILE"
rm -f -- "$OLD_PERMISSIONS_FILE"