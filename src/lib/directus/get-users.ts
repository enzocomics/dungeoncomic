import { cache } from "react"
import { publicClient, userClient } from "./clients"
import { QueryFilter, readUser, readUsers } from "@directus/sdk"
import { DirectusSchema, DirectusUser } from "./schema"
import { cacheTag } from "next/cache"
import type { Filter } from "@directus/types"

export const getUsers = cache(
	async (filter?: QueryFilter<DirectusSchema, DirectusUser>) => {
		// "use cache"
		// cacheTag("users")
		const response = await publicClient.request(
			readUsers({
				filter: filter as Filter,
				fields: [
					// Profile
					"name",
					"description",
					"location",
					"homepage_url",
					// Account
					"id",
					"email",
					"username",
					"avatar",
					"status",
				],
			}),
		)

		return response
	},
)

export const getUser = cache(async (userId: string) => {
	const response = await userClient.request(
		readUser(userId, {
			fields: [
				// Profile
				"name",
				"description",
				"location",
				"homepage_url",
				"description",
				// Account
				"id",
				"email",
				"username",
				"avatar",
				"status",
			],
		}),
	)

	return response
})
