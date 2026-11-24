"use server"

import { parseWithZod } from "@conform-to/zod/v4"
import { dashboardSchema } from "@/ui/dashboard/functions/schema"
import { userClient } from "@/lib/directus/clients"
import { deleteFile, updateMe, uploadFiles } from "@directus/sdk"
import { updateTag } from "next/cache"

export async function saveProfile(prevState: unknown, formData: FormData) {
	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: dashboardSchema({ name: "directus_users" }),
	})
	// Create a list of the fields we want to fetch from FormData
	const fields = ["name", "location", "description", "homepage_url"]

	const imageFields = ["avatar"] as const

	try {
		if (submission.status === "success") {
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

			// Iterate through the imageFields
			for (const field of imageFields) {
				// Check if the clear field has been filled out
				const shouldClear = formData.get(`avatar_clear`)

				// If the clear field is true:
				if (shouldClear) {
					updates[field] = null // set the relational field in the singleton to empty
					const imageID = formData.get(`avatar_id`)
					const deleteImage = imageID // Delete actual file from the cms
						? await userClient.request(deleteFile(String(imageID)))
						: null
					continue
				}

				// TODO: we need logic here that deletes the old image when it is being replaced with a new image

				// If the clear field is not set:
				// Get the file
				const value = formData.get(`directus_users.${field}`)

				// skip unless the value is an actual File and has filesize
				if (!(value instanceof File) || value.size === 0) continue

				// create a new FormData object to send the file to Directus
				const uploadData = new FormData()
				uploadData.append("file", value)
				const uploaded = await userClient.request(uploadFiles(uploadData))
				updates[field] = uploaded.id
			}
			// Update CMS and pass the object

			const updateProfile = await userClient.request(updateMe(updates))

			const username = formData.get("username")
			updateTag(`user-${username}`)
			updateTag(`userpage-${username}`)
		}
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
