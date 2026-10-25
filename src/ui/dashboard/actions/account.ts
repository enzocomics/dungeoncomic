"use server"

import { parseWithZod } from "@conform-to/zod/v4"
import { dashboardSchema } from "../functions/schema"
import { userClient } from "@/lib/directus/clients"
import { updateTag } from "next/cache"
import { updateMe } from "@directus/sdk"

export async function saveAccount(prevState: unknown, formData: FormData) {
	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: dashboardSchema("directus_users"),
	})

	// Create a list of the fields we want to fetch from formdata
	const fields = ["username", "email"]

	try {
		// Create a type from the names in the `fields` array
		type SettingField = (typeof fields)[number]
		// Create an empty object for the update, whose keys can be any of the fields in SettingField, but thery're all optional. Each included value must be `string | null`
		const updates: Partial<Record<SettingField, string | null>> = {}

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
		const updateSettings = await userClient.request(updateMe(updates))
		updateTag("user")

		console.log(updateSettings)
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
