"use server"
import { parseWithZod } from "@conform-to/zod/v4"
import { settingsSchema } from "../functions/settings-schema"
import { userClient } from "@/lib/directus/clients"
import { deleteFile, updateSingleton, uploadFiles } from "@directus/sdk"
import { updateTag } from "next/cache"

export async function saveSettings(prevState: unknown, formData: FormData) {
	// VALIDATION
	const submission = parseWithZod(formData, { schema: settingsSchema() })

	// Create a list of the fields we want to fetch from formdata
	const fields = [
		// DETAILS
		"project_name",
		"project_url",
		"routing_mode",
		"frontpage_comic",
		// TYPES
		"comic_type_name",
		"comic_type_name_plural",
		"comic_type_name_slug",
		"comic_type_name_plural_slug",
		"user_type_name",
		"user_type_name_plural",
		"user_type_name_slug",
		"user_type_name_plural_slug",
		// APPEARANCE
		"color_accent",
		// "project_logo",
		// "project_banner",
		// FONTS
		"font_headers",
		"font_labels",
		"font_copy",
		"font_mono",
		// CONTENT
		"homepage_content",
		"date_established",
		"copyright_message",
	] as const

	const imageFields = ["project_logo", "project_banner"] as const

	try {
		// Create a type from the names in the `fields` array
		type SettingField = (typeof fields | typeof imageFields)[number]

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

		// Iterate through the imageFields
		for (const field of imageFields) {
			// Check if the clear field has been filled out
			const shouldClear = formData.get(`settings.${field}_file_clear`)

			// If the clear field is true:
			if (shouldClear) {
				updates[field] = null // set the relational field in the singleton to empty
				const imageID = formData.get(`settings.${field}_id`)
				const deleteImage = imageID // Delete actual file from the cms
					? await userClient.request(deleteFile(String(imageID)))
					: null
				continue
			}

			// If the clear field is not set:
			// Get the file
			const value = formData.get(`settings.${field}_file`)

			// skip unless the value is an actual File and has filesize
			if (!(value instanceof File) || value.size === 0) continue

			// create a new FormData object to send the file to Directus
			const uploadData = new FormData()
			uploadData.append("file", value)
			const uploaded = await userClient.request(uploadFiles(uploadData))
			updates[field] = uploaded.id
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
