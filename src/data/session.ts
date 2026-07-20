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
 * - Returns the user object
 */
export const verifySession = cache(async () => {
	try {
		const response = await userClient.request(readMe())
		return response
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return reason
	}
})
