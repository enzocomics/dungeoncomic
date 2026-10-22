import z from "zod"
import { ListFields, ListFieldsField } from "@/ui/dashboard/functions/list-fields"
/**----------------------------------- */
// VALIDATION SCHEMA
export const settingsSchema = (
	name: string,
	fieldLists?: Record<string, ListFieldsField>[],
) => {
	// Make a zod object with the provided fieldsLists
	const zObject = Object.fromEntries( // Turn the remaining pairs back into an object
		(fieldLists ?? []).flatMap((data) => // Iterate through the array
			Object.entries(data).flatMap(([key, field]) => {// Turn the fieldsList object into [key,value] pairs

				// "validate" in field ? [[key, field.validate] as const] : [] // Check if the pair has a validate property
				if (!("validate" in field) || !field.validate) return []

				// Runs for each field that has a validator
				let thing

				if (field.validate) {
					if (field.type == "text")
						thing = z.string().max(field.maxLength || -1)

					if (field.type == "url")
						thing = z.union([
							z.httpUrl(),
							z.url({ hostname: /^localhost$/ })
						])

					if (field.type == "email")
						thing = z.email()

					if (field.type == "image")
						thing = z.instanceof(File)
							.optional()
							.refine((file) => {
								return !file || file.size <= 1024 * 1024
							}, "File size must be less than 1mb")
							.refine((file) => {
								return !file || ["image/png", "image/gif", "image/jpeg", "image/webp"].includes(file.type)
							}, "Filetype not accepted")
					// .max(1_000_000).mime(["image/png", "image/gif", "image/jpeg", "image/webp"])
				}
				return [[key, thing] as const]

			})
		).filter((item) => Object.keys(item).length > 0) // Remove any objects with 0 keys
	)

	return z.object({
		[name]: z.object(zObject)
	})
}
