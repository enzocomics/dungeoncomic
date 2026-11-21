"use server"
import { parseWithZod } from "@conform-to/zod/v4"
import { dashboardSchema } from "../functions/schema"
import { adminClient, userClient } from "@/lib/directus/clients"
import { updateTag } from "next/cache"
import { readUsers, updateMe } from "@directus/sdk"

import { getTranslations } from "next-intl/server"
import { accountSchema } from "../functions/schema-account"
import { verifySession } from "@/data/session"

export async function saveAccount(prevState: unknown, formData: FormData) {
	// I18N
	const t = await getTranslations("auth")

	// User
	const session = await verifySession()
	// VALIDATION
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			accountSchema(t, intent, {
				// Check if the email is unique in Directus
				async isEmailUnique(email) {
					// Don't check if the email wasn't changed (still matches db)
					if (formData.get("email") === session?.email) {
						return true
					}
					// If it's an email
					const request = await adminClient.request(
						readUsers({
							filter: {
								email: { _eq: email },
							},
							limit: 1,
						}),
					)

					// Return Boolean
					return request.length > 0 ? false : true
				},
				// Check if the username is unique in Directus
				async isUsernameUnique(username) {
					// Don't check if the username wasn't changed (still matches db)
					if (formData.get("username") === session?.username) {
						return true
					}

					// If it's an username
					const request = await adminClient.request(
						readUsers({
							filter: {
								username: { _eq: username },
							},
							limit: 1,
						}),
					)

					// Return Boolean
					return request.length > 0 ? false : true
				},
			}),
		async: true,
	})

	// Create a list of the fields we want to fetch from formdata
	const fields = ["username", "email", "password"]

	try {
		if (submission.status === "success") {
			// // Create a type from the names in the `fields` array
			type SettingField = (typeof fields)[number]
			// // Create an empty object for the update, whose keys can be any of the fields in SettingField, but thery're all optional. Each included value must be `string | null`
			const updates: Partial<Record<SettingField, string | null>> = {}

			// // Iterate through the fieldsArray
			for (const field of fields) {
				// Get each formdatad field by its name
				const value = formData.get(`${field}`)

				// skip the field if its value is null or empty (not submitted)
				if (value === null || value === "") continue

				if (typeof value !== "string") continue // Ignore File values

				// if the submitted value is __CLEAR__ then send null to directus
				updates[field] = value === "__CLEAR__" ? null : value
			}

			// const updates = {
			// 	username: formData.get("username") as string,
			// 	email: formData.get("email") as string,
			// }

			// console.log(updates)
			// Update CMS and pass the object
			const updateSettings = await userClient.request(updateMe(updates))
			updateTag("user")

			// console.log(updateSettings)
		}
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
