"use server"

import { parseWithZod } from "@conform-to/zod/v4"
import { dashboardSchema } from "@/ui/dashboard/functions/schema"

export async function saveProfile(prevState: unknown, formData: FormData) {
	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: dashboardSchema({ name: "directus_users" }),
	})
	console.log("submit")
	// Create a list of the fields we want to fetch from FormData
	const fields = ["name"]

	try {
		// Create a type from the names in the `fields` array
		type ProfileField = (typeof fields)[number]
		// Create an empty object for the update, whose keys can be any of hte fields in ProfileField, but they're all optional. Each included value must be `string | null`
		const updates: Partial<Record<ProfileField, string | null>> = {}

		// Iterate through the fieldsArray
		for (const field of fields) {
			// Get each formdatad field by its name
			const value = formData.get(`directus_users.${field}`)

			// skip the field if its value is null (not submitted)
			if (value === null) continue

			if (typeof value !== "string") continue // Ignore File values

			// if the submitted value is __CLEAR__ then send null to directus
			updates[field] = value === "__CLEAR__" ? null : value
		}

		// Update CMS and pass the object

		console.log(updates)
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESSFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return submission.reply({
			formErrors: [reason],
		})
	}

	return submission.reply()
}
