import "server-only"
/**----------------------------------- */
// LIBRARIES
import { cache } from "react"
// CMS
import { readMe, readRole, readUser, readUserPermissions } from "@directus/sdk"
import { adminClient, userClient } from "@/lib/directus/clients"

/** ------------------------------------------------ **
 * VERIFY SESSION
 * - We verify if a session exists by checking if the user can access their own account details
 * - Returns the user object if successful, or `false` if not
 */
export const verifySession = cache(async () => {
	try {
		// Get the logged-in user object
		const readMeResponse = await userClient.request(
			readMe({
				fields: [
					"id",
					"email",
					"name",
					"username",
					"homepage_url",
					"avatar",
					"status",
				],
			}),
		)

		// Get the logged-in user permissions
		const readMyPermissions = await userClient.request(readUserPermissions())

		// Merge them into the same object
		const mergedObject = {
			...readMeResponse,
			permissions: readMyPermissions,
		}

		return mergedObject
	} catch {
		return false
	}
})
