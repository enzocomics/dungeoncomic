"use server"

import { getComic, getComicPage } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
import { PagesCollection } from "@/lib/directus/schema"
import slugify from "@/lib/slugify"
import { cookies } from "next/headers"

/** ------------------------------------------------ **
 * SAVE USER VARIABLES COOKIE
 * ---
 */

export async function saveUserVarsCookie({
	vars,
	page,
}: {
	vars: Record<string, string | null>
	page: Awaited<ReturnType<typeof getComicPage>>
}) {
	// Retrieve Cookies & Variables
	const cookieStore = await cookies()
	const settings = await getSettings()
	const title = page.comic.title

	// Build meaningful cookie name string
	// Outputs as: appname_comicname_uservars
	const name = `${slugify({
		string: settings.project_name!,
		separator: "",
	})}_${slugify({
		string: title,
		separator: "",
	})}_uservars`

	// Store cookie
	try {
		cookieStore.set({
			name: name,
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
 * RETRIEVE USER VARIABLES COOKIE
 * ---
 */
export async function getUserVarsCookie({
	comic,
}: {
	comic: Awaited<ReturnType<typeof getComic>>
}) {
	// Retrieve Cookies & Variables
	const cookieStore = await cookies()
	const settings = await getSettings()
	const title = comic.title

	// Build meaningful cookie name string
	// Outputs as: appname_comicname_uservars
	const name = `${slugify({
		string: settings.project_name!,
		separator: "",
	})}_${slugify({
		string: title,
		separator: "",
	})}_uservars`

	try {
		if (cookieStore.has(name)) {
			return cookieStore.get(name) && cookieStore.get(name)!.value
				? cookieStore.get(name)!.value
				: null
		}
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return error
	}
}
