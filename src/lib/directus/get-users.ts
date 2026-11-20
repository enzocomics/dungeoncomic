import { cache } from "react"
import { userClient } from "./clients"
import { readUser } from "@directus/sdk"

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
