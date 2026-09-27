import { cache } from "react"
import { userClient } from "./clients"
import { readUser } from "@directus/sdk"

export const getUser = cache(async (userId: string) => {
	const response = await userClient.request(
		readUser(userId, {
			fields: ["avatar", "email", "homepage_url", "id", "name", "username"],
		}),
	)

	return response
})
