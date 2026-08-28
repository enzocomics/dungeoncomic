"use server"

import { getComic } from "@/lib/directus/get-comics"
import { PagesCollection } from "@/lib/directus/schema"
import { cookies } from "next/headers"

/** ------------------------------------------------ **
 * SAVE USER VARIABLES COOKIE
 * ---
 */

export async function saveUserVarsCookie(vars: { [k: string]: string | null }) {
	const cookieStore = await cookies()

	try {
		cookieStore.set({
			name: "DungeonComic UserVars",
			value: JSON.stringify(vars),
		})
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return { error, reason }
	}
	return "success"
}

/** ------------------------------------------------ **
 * RETREIVE USER VARIABLES COOKIE
 * ---
 */
export async function getUserVarsCookie(
	comic: Awaited<ReturnType<typeof getComic>>,
) {
	const cookieStore = await cookies()

	try {
		if (cookieStore.has("DungeonComic UserVars")) {
			return cookieStore.get("DungeonComic UserVars")!.value
		}
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return error
	}
}
