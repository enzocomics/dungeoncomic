"use server"
/**----------------------------------- */
// LIBRARIES
import { cookies } from "next/headers"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { AuthenticationData } from "@directus/sdk"
import { encrypt, decrypt } from "@/lib/jose"
import { userCookieName } from "./env"

/**-----------------------------------
 * ACTION: Delete User Cookie
 *
 */
export async function deleteUserCookie(
	// the CookieStore needs to be passed to ensure it's using the right context (server action)
	cookieStore: ReadonlyRequestCookies,
) {
	cookieStore.delete(userCookieName)
}

/**-----------------------------------
 * ACTION: Get User Cookie
 *
 */
export async function getUserCookie() {
	// Retrieve cookies
	const cookieStore = await cookies()
	// If the user cookie exists, see if we can decrypt it
	if (cookieStore.has(userCookieName)) {
		const encryptedCookie = cookieStore.get(userCookieName)
		const cookie = encryptedCookie
			? await decrypt(encryptedCookie.value)
			: undefined
		// If we can decrypt it successfully, return the data
		if (cookie) {
			const data: AuthenticationData = {
				access_token: cookie.access_token,
				refresh_token: cookie.refresh_token,
				expires_at: cookie.expiresAt,
				expires: cookie.expiresAt,
			}
			return data
		}
	}
	// Return nothing if unsuccessful
	return null
}

/**-----------------------------------
 * Server Action: Save User Cookie
 *
 */
export async function saveUserCookie(
	// the CookieStore needs to be passed to ensure it's using the right context (server action)
	cookieStore: ReadonlyRequestCookies,
	data: AuthenticationData,
) {
	// Set Directus Variables
	const expires = data.expires ? data.expires / 1000 : 0
	const expires_at = data.expires_at ? data.expires_at / 1000 : expires
	const access_token = data.access_token
	const refresh_token = data.refresh_token
	let payload

	// create a JWT encrypted cookie with the login data
	if (access_token) {
		payload = {
			access_token: access_token,
			refresh_token: refresh_token,
			expiresAt: expires_at,
		}
		payload = await encrypt(payload)

		// set the cookie
		cookieStore.set({
			name: userCookieName,
			value: payload,
			expires: expires_at,
			maxAge: expires,
			path: "/",
			secure: true,
			httpOnly: true,
			sameSite: "strict",
		})
	}
}
