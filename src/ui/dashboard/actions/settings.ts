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
	] as const

	try {
		// Iterate through the fields and create an object that only get the formdata from fields that have been submitted (not null)
		const updates = Object.fromEntries(
			fields.flatMap((field) => {
				const value = formData.get(`settings.${field}`)
				return value === null ? [] : [[field, value]]
			}),
		)

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
