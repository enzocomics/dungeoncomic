"use server"
/**----------------------------------- */
// LIBRARIES
import { cookies } from "next/headers"
import { encrypt, decrypt } from "@/lib/jose"
import slugify from "@/lib/slugify"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
import { getComic, getComicPage } from "@/lib/directus/get-comics"

/** ----------------------------------------------------------------- */
/**
 * Save the reader's customized comic variables to a cookie
 *
 * @param params
 * @param params.vars - the variables to be saved
 * @param params.page - the Directus PageCollection item object
 *
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

	// Encrypt vars
	const encryptedVars = await encrypt(vars)

	// Store cookie
	try {
		cookieStore.set({
			name: name,
			value: encryptedVars,
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

/** ----------------------------------------------------------------- */
/**
 * Fetch the reader's customized comic variables from a cookie
 *
 * @param params
 * @param params.comic - the Directus Comic collection item object
 * @returns The cookie object
 *
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
			const vars =
				cookieStore.get(name) && cookieStore.get(name)!.value
					? cookieStore.get(name)!.value
					: null

			const decryptedVars = vars
				? ((await decrypt(vars)) as Record<string, string | null>)
				: null

			return decryptedVars
		}
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return error
	}
}
