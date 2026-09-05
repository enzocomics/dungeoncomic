"use server"
/**----------------------------------- */
// LIBRARIES
import { cookies } from "next/headers"
import { encrypt, decrypt } from "@/lib/jose"
import slugify from "@/lib/slugify"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
import { getComic, getComicPage } from "@/lib/directus/get-comics"
import { parseWithZod } from "@conform-to/zod/v4"
import { userVariablesSchema } from "@/lib/zod/schemas/comic"

/** ----------------------------------------------------------------- */
/**
 * Save the reader's customized comic variables to a cookie

 */

export async function saveUserVars(prevState: unknown, formData: FormData) {
	// VALIDATION
	const submission = parseWithZod(formData, { schema: userVariablesSchema() })

	const pageVars = JSON.parse(formData.get("pageVars")!.toString())

	let cookiePayload = {}
	// Iterate through the variables and dynamically get each one based on its id
	Object.values(pageVars).forEach((v: any) => {
		const slug = pageVars[v.id].slug
		const value = formData.get(`userVars.var${v.id}`)
		// Update the cookie payload
		cookiePayload = {
			...cookiePayload,
			[slug]: value,
		}
	})

	// Retrieve Cookies & Variables
	const cookieStore = await cookies()
	const settings = await getSettings()
	const page = JSON.parse(
		formData.get("comicPage") as string,
	) as unknown as Awaited<ReturnType<typeof getComicPage>>
	const title = page.comic.title
	const comic = await getComic(page.comic.slug)
	// Retrieve existing vars if they exist
	const oldCookiePayload = await getUserVarsCookie({ comic: comic })

	// Combine the variables. Object.assign will overwrite any existing keys with the newer inputs from `vars`
	const updatedPayload = oldCookiePayload
		? Object.assign({}, oldCookiePayload, cookiePayload)
		: cookiePayload

	// Build meaningful cookie name string
	// Outputs as: appname_comicname_uservars
	const name = `${slugify({
		string: settings.project_name!,
		separator: "",
	})}_${slugify({
		string: title,
		separator: "",
	})}_uservars`

	// // Encrypt vars
	const encryptedPayload = await encrypt(updatedPayload)

	// Uncomment this to unencrypt and test input
	// const encryptedVars = JSON.stringify(updatedVars)

	// SAVE USER VARIABLES TO COOKIES
	try {
		cookieStore.set({
			name: name,
			value: encryptedPayload,
			httpOnly: true,
			sameSite: "strict",
			maxAge: 60 * 60 * 24 * 30 * 3, // 3 months
		})
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return submission.reply({
			formErrors: [reason],
		})
	}
	// RETURN REPLY so that its last value may be used
	return submission.reply()
}

// export async function saveUserVarsCookie({
// 	vars,
// 	page,
// }: {
// 	vars: Record<string, string | null>
// 	page: Awaited<ReturnType<typeof getComicPage>>
// }) {
// 	// Retrieve Cookies & Variables
// 	const cookieStore = await cookies()
// 	const settings = await getSettings()
// 	const title = page.comic.title
// 	const comic = await getComic(page.comic.slug)

// 	// Retrieve existing vars if they exist
// 	const oldVars = await getUserVarsCookie({ comic: comic })

// 	// Combine the variables. Object.assign will overwrite any existing keys with the newer inputs from `vars`
// 	const updatedVars = oldVars ? Object.assign({}, oldVars, vars) : vars

// 	// Build meaningful cookie name string
// 	// Outputs as: appname_comicname_uservars
// 	const name = `${slugify({
// 		string: settings.project_name!,
// 		separator: "",
// 	})}_${slugify({
// 		string: title,
// 		separator: "",
// 	})}_uservars`

// 	// Encrypt vars
// 	const encryptedVars = await encrypt(vars)

// 	// Uncomment this to unencrypt and test input
// 	// const encryptedVars = JSON.stringify(updatedVars)

// 	// Store cookie
// 	try {
// 		cookieStore.set({
// 			name: name,
// 			value: encryptedVars,
// 			httpOnly: true,
// 			sameSite: "strict",
// 			maxAge: 60 * 60 * 24 * 30 * 3, // 3 months
// 		})
// 	} catch (err: any) {
// 		// RETURN ERROR IF UNSUCCESFUL
// 		const error = err.errors?.[0]
// 		const code = error?.extensions?.code
// 		const reason = error?.message
// 		return { error, reason }
// 	}
// 	return "success"
// }

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

			// Uncomment this to unencrypt and test input
			// const decryptedVars = vars ? JSON.parse(vars) : null

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
