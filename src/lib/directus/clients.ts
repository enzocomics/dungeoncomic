/** ------------------------------------------------ **/
// LIBRARIES
import {
	authentication,
	createDirectus,
	rest,
	staticToken,
} from "@directus/sdk"

// VARIABLES
import { adminToken, directusURL } from "@/data/env"

// CMS
import { DirectusSchema } from "@/lib/directus/schema"
import { deleteUserCookie, getUserCookie, saveUserCookie } from "@/data/cookies"
import { cookies } from "next/headers"

/** ------------------------------------------------ **/
// Directus client for making public API queries
export const publicClient =
	createDirectus<DirectusSchema>(directusURL).with(rest())

/** ------------------------------------------------ **/
// Directus client for making user API queries
export const userClient = createDirectus<DirectusSchema>(directusURL)
	.with(
		authentication("json", {
			storage: {
				// return the objects from cookies
				get: async () => {
					return await getUserCookie()
				},
				// persist the new token object into a cookie
				set: async (value) => {
					const cookieStore = await cookies()
					if (value) {
						// we can't edit cookies in client component, so check if the window does NOT exist
						if (typeof window === "undefined")
							// save user cookie
							await saveUserCookie(cookieStore, value)
					} else {
						// we can't edit cookies in client component, so check if the window does NOT exist
						if (typeof window === "undefined")
							// delete cookie
							await deleteUserCookie(cookieStore)
					}
				},
			},
		}),
	)
	.with(rest())

/** ------------------------------------------------ **/
// Directus client for making admin API queries
export const adminClient = createDirectus<DirectusSchema>(directusURL)
	.with(staticToken(adminToken))
	.with(rest())
