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
# Set up the default variables for the default comic
title="Dungeon Comic Tutorial"
slug="tutorial2"
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
COMIC_RESPONSE=$(curl -X POST "$NEXT_PUBLIC_CMS_URL/items/comics" \
  -H "Authorization: Bearer $CMS_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$DEFAULT_COMIC_PAYLOAD")
# Get the Comic ID: we will set it as the frontpage_comic in the project settings
COMIC_ID=$(echo "$COMIC_RESPONSE" | jq -r '.data.id')


PAGE1_PANEL1_DESC=$(cat << 'EOF'
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
EOF
)

PAGE1_PANEL1=$(jq -n \
  --arg panel_description "$PAGE1_PANEL1_DESC" \
  '{panel_description: $panel_description}'
)

#
PAGE1_PAYLOAD=$(jq -n \
--arg comic "$COMIC_ID" \
--arg comic_pagenum "1" \
--arg status "published" \
--arg title "The Adventure Begins." \
--argjson panel1 "$PAGE1_PANEL1" \
'{comic: $comic, comic_pagenum: $comic_pagenum, status: $status, title: $title, comic_panels: [$panel1]}'
)

echo "$PAGE1_PAYLOAD"
