"use server"
/**----------------------------------- */
// LIBRARIES
import { revalidateTag, updateTag } from "next/cache"
// VALIDATION
import { parseWithZod } from "@conform-to/zod/v4"
import { dashboardSchema } from "@/ui/dashboard/functions/schema"
// DATA
import { userClient } from "@/lib/directus/clients"
import { createItem, deleteFile, updateMe, uploadFiles } from "@directus/sdk"

/** ---
 * Handles & submits Dashboard Forms
 *
 * @param prevState
 * @param formData
 */
export async function saveDashboardForm(
	prevState: unknown,
	formData: FormData,
) {
	// Get the name of the schema
	const schema = formData.get("schema") as string
	const action = formData.get("action") as string

	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: dashboardSchema({ name: schema }),
	})

	try {
		if (submission.status === "success") {
			// Make an iterable array of the collection fields
			const fields = [
				// - Return each form entry as a pair `[key, value]`
				// - turn those entries into an array so we can use array methods
				...formData.entries(),
			]
				.filter(
					// Check each pair. `[key,value]` syntax pulls the two items out that we want to use
					([key, value]) =>
						// Keep only the entries we want that start with the schema name
						key.startsWith(`${schema}.`) &&
						// exclude entries whose value is a file object (images)
						!(value instanceof File),
				)
				// Take the remaining entries and just pull out the key
				// Remove the schema prefix, which just leaves the field name
				.map(([key]) => key.slice(`${schema}.`.length))
			// Final shape: ["field1", "field2"]
			// Make an iterable array of the collection fields

			// Do the same thing but pull out the image fields
			const imageFields = [...formData.entries()]
				.filter(
					([key, value]) =>
						key.startsWith(`${schema}.`) &&
						// this time, only retain fields with files
						value instanceof File,
				)
				.map(([key]) => key.slice(`${schema}.`.length))
			// Final shape: ["field1", "field2"]

			// Create a type from the names in the `fields` & `imageFields` arrays
			type DirectusField = (typeof fields | typeof imageFields)[number]

			// Create an empty object for the update, whose keys can be any of the fields in DirectusField, but thery're all optional. Each included value must be `string | null`
			const updates: Partial<Record<DirectusField, string | null>> = {}

			// Iterate through the field sArray
			for (const field of fields) {
				// Get each formdatad field by its name
				const value = formData.get(`${schema}.${field}`)

				// skip the field if its value is null (not submitted)
				if (value === null) continue

				if (typeof value !== "string") continue // Ignore File values

				// if the submitted value is __CLEAR__ then send null to directus
				updates[field] = value === "__CLEAR__" ? null : value
			}

			// Iterate through the imageFields Array
			for (const field of imageFields) {
				// Check if the clear field has been filled out
				const shouldClear = formData.get(`${schema}.${field}_file_clear`)

				// If the clear field is true:
				if (shouldClear) {
					updates[field] = null // set the relational field in the singleton to empty
					const imageID = formData.get(`${schema}.${field}_id`)
					const deleteImage = imageID // Delete actual file from the cms
						? await userClient.request(deleteFile(String(imageID)))
						: null
					continue
				}

				// TODO: we need logic here that deletes the old image when it is being replaced with a new image

				// If the clear field is not set:
				// Get the file
				const value = formData.get(`${schema}.${field}`)

				// skip unless the value is an actual File and has filesize
				if (!(value instanceof File) || value.size === 0) continue

				// create a new FormData object to send the file to Directus
				const uploadData = new FormData()
				uploadData.append("file", value)
				const uploaded = await userClient.request(uploadFiles(uploadData))
				updates[field] = uploaded.id
			}

			//
			switch (schema) {
				case "comics": {
					action === "create" &&
						(await userClient.request(createItem(schema, updates)))

					updateTag(schema)
				}
			}
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

	return submission.reply()
}
