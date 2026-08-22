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

# Retrieve the UUID of the initial admin user
ADMINRESPONSE=$(curl -g -X GET "$NEXT_PUBLIC_CMS_URL/users?filter[role][name][_eq]=Administrator" \
	-H "Authorization: Bearer $CMS_ADMIN_TOKEN")
ADMIN_UUID=$(echo "$ADMINRESPONSE" | jq -r '.data[0].id')

##------------------------------------------------------##
# Set up the default variables for the default comic
title="My Dungeon Comic"
slug="mydungeoncomic"
description="Hello! This is a starter dungeon with example content. Edit or delete it, and happy building!"
authors=$ADMIN_UUID

# Set up the payload for the DEFAULT COMIC settings
DEFAULT_COMIC_PAYLOAD=$(jq -n \
--arg title "$title" \
--arg slug "$slug" \
--arg description "$description" \
--arg authors "$authors" \
'{title: $title, slug: $slug, description: $description, authors: [$authors] }')

# Update our DEFAULT `comic` collection 
COMICRESPONSE=$(curl -X POST "$NEXT_PUBLIC_CMS_URL/items/comics" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$DEFAULT_COMIC_PAYLOAD")
# Get the Comic ID: we will set it as the frontpage_comic in the project settings
COMIC_ID=$(echo "$COMICRESPONSE" | jq -r '.data.id')

##------------------------------------------------------##
# Set up the default variables for the project settings
project_name="Dungeon Construction Co."
project_url=$NEXT_PUBLIC_SITE_URL
frontpage_comic=$COMIC_ID

# Set up the payload for the PROJECT settings
PROJECT_SETTINGS_PAYLOAD=$(jq -n \
--arg project_name "$project_name" \
--arg project_url "$project_url" \
--arg frontpage_comic "$frontpage_comic" \
'{project_name: $project_name, project_url: $project_url, frontpage_comic: $frontpage_comic}')

# Update our project `settings` collection 
curl -X PATCH "$NEXT_PUBLIC_CMS_URL/items/settings" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PROJECT_SETTINGS_PAYLOAD"

##------------------------------------------------------##
# Set up the default variables for DIRECTUS settings
project_color="#7c7c67"
project_logo=$LOGO_UUID
public_registration=true
public_registration_role="5ad2a6f5-74a6-4ebc-9864-5e7b451203d2" #TODO: this should not be hardcoded

# Set up the payload for DIRECTUS settings
DIRECTUS_SETTINGS_PAYLOAD=$(jq -n \
--arg project_name "$project_name" \
--arg project_url "$project_url" \
--arg project_logo "$project_logo" \
--arg project_color "$project_color" \
--arg public_registration "$public_registration" \
--arg public_registration_role "$public_registration_role" \
'{project_name: $project_name, project_url: $project_url, project_logo: $project_logo, project_color: $project_color, public_registration: $public_registration, public_registration_role: $public_registration_role }')


# Update default `directus_settings` collection 
curl -X PATCH "$NEXT_PUBLIC_CMS_URL/settings" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$DIRECTUS_SETTINGS_PAYLOAD"


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