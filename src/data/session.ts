import "server-only"
/**----------------------------------- */
// LIBRARIES
import { cache } from "react"
// CMS
import { readMe } from "@directus/sdk"
import { userClient } from "@/lib/directus/clients"

/** ------------------------------------------------ **
 * VERIFY SESSION
 * - We verify if a session exists by checking if the user can access their own account details
 * - Returns the user object if successful, or `false` if not
 */
export const verifySession = cache(async () => {
	try {
		const response = await userClient.request(readMe())
		return response
	} catch {
		return false
	}
})
