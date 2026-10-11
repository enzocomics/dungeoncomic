"use server"
import { parseWithZod } from "@conform-to/zod/v4"
import { settingsSchema } from "../functions/settings-schema"
import { userClient } from "@/lib/directus/clients"
import { updateSingleton } from "@directus/sdk"
import { updateTag } from "next/cache"

export async function saveSettings(prevState: unknown, formData: FormData) {
	// VALIDATION
	const submission = parseWithZod(formData, { schema: settingsSchema() })

	// Createa a list of the fields we want to fetch from formdata
	const fields = [
		"project_name",
		"project_url",
		"routing_mode",
		"frontpage_comic",
		"comic_type_name",
		"comic_type_name_plural",
		"comic_type_name_slug",
		"comic_type_name_plural_slug",
		"user_type_name",
		"user_type_name_plural",
		"user_type_name_slug",
		"user_type_name_plural_slug",
	] as const

	try {
		// Create a type from the names in the `fields` array
		type SettingField = (typeof fields)[number]

		// Create an empty object for the update, whose keys can be any of the fields in SettingField, but thery're all optional. Each included value must be `string | null`
		const updates: Partial<Record<SettingField, string | null>> = {}

		// Iterate through the fieldsArray
		for (const field of fields) {
			// Get each formdatad field by its name
			const value = formData.get(`settings.${field}`)

			// skip the field if its value is null (not submitted)
			if (value === null) continue
			if (typeof value !== "string") continue // Ignore File values

			// if the submitted value is __CLEAR__ then send null to directus
			updates[field] = value === "__CLEAR__" ? null : value
		}

		// Update CMS and pass the object
		const updateSettings = await userClient.request(
			updateSingleton("settings", updates),
		)
		updateTag("settings")
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
