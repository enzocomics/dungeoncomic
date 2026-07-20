"use server"
/**----------------------------------- */
// LIBRARIES
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { userClient } from "@/lib/directus/clients"
import { deleteUserCookie, getUserCookie } from "@/data/cookies"

/** ------------------------------------------------ **
 * LOGOUT ACTION
 */
export async function logout() {
	const cookieStore = await cookies()
	const cookie = await getUserCookie()
	if (cookie) {
		const refresh_token = cookie.refresh_token as string
		// Log out of Directus
		await userClient.logout({ refresh_token: refresh_token })
		// Delete the cookie
		await deleteUserCookie(cookieStore)
		// Redirect to homepage
	}
	redirect("/")
}
