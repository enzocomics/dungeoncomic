import { cache } from "react"
import { publicClient, userClient } from "./clients"
import {
	QueryFilter,
	readFile,
	readUser,
	readUsers,
	StringLiteralUnion,
} from "@directus/sdk"
import { DirectusSchema, DirectusUser } from "./schema"
import { cacheTag } from "next/cache"
import type { Filter } from "@directus/types"

type UserWithAvatar = {
	avatar: {
		description: string | null
		id: string
		filename_disk: string | null
		type: string | null
		width: number | null
		height: number | null
	} | null
	name: string | null
	description: string | null
	location: string | null
	homepage_url: string | null
	id: string
	email: string | null
	username: string | null
	status: StringLiteralUnion<
		| "draft"
		| "invited"
		| "unverified"
		| "active"
		| "suspended"
		| "archived"
		| "inactive-license"
	>
}

export const getUsers = cache(
	async (filter?: QueryFilter<DirectusSchema, DirectusUser>) => {
		"use cache"
		cacheTag("users")
		// Fetch the users via filter
		const usersResponse = await publicClient.request(
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

		// Fetch each user's avatar if it exists
		let usersWithAvatarArray: UserWithAvatar[] = usersResponse
			? await Promise.all(
					usersResponse.map(async (user) => {
						const avatarResponse = user.avatar
							? await publicClient.request(
									readFile(String(user.avatar), {
										fields: [
											"id",
											"filename_disk",
											"height",
											"width",
											"description",
											"type",
										],
									}),
								)
							: null // No avatar

						// Merge the avatar object into the current user object
						return {
							...user,
							avatar: avatarResponse,
						}
					}),
				)
			: []
		// Return the users object array with avatar objects included
		return usersWithAvatarArray
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
