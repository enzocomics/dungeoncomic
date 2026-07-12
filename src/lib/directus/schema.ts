import { User } from "@directus/types"

interface DirectusUser extends User {
	username: string
}

export interface DirectusSchema {
	directus_users: DirectusUser
}
