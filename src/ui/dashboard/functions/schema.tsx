import z from "zod"
import { ListFields, ListFieldsField } from "@/ui/dashboard/functions/list-fields"
import { Intent } from "@conform-to/react"
/**----------------------------------- */
// VALIDATION SCHEMA
export const dashboardSchema = ({
	name,
	fieldLists,
	intent = null
}: {
	name: string,
	fieldLists?: Record<string, ListFieldsField>[],
	intent?: Intent | null
}) => {
	// Make a zod object with the provided fieldsLists
	const zObject = Object.fromEntries( // Turn the remaining pairs back into an object
		(fieldLists ?? []).flatMap((data) => // Iterate through the array
			Object.entries(data).flatMap(([key, field]) => {// Turn the fieldsList object into [key,value] pairs

				// "validate" in field ? [[key, field.validate] as const] : [] // Check if the pair has a validate property
				if (!("validate" in field) || !field.validate) return []

				// Runs for each field that has a validator
				let thing

				if (field.validate) {
					// ----------------------------
					if (field.type == "text" && !field.optional)
						thing = z.string().max(field.maxLength || 64)

					if (field.type == "text" && field.optional)
						thing = z.string().max(field.maxLength || 64).optional()

					// ----------------------------
					if (field.type == "textarea" && !field.optional)
						thing = z.string().max(field.maxLength || 1280)

					if (field.type == "textarea" && field.optional)
						thing = z.string().max(field.maxLength || 1280).optional()

					// ----------------------------
					if (field.type == "url" && !field.optional)
						thing = z.union([
							z.httpUrl(),
							z.url({ hostname: /^localhost$/ })
						])

					if (field.type == "url" && field.optional)
						thing = z.union([
							z.httpUrl(),
							z.url({ hostname: /^localhost$/ })
						]).optional()

					// ----------------------------
					if (field.type == "email" && !field.optional)
						thing = z.email()

					if (field.type == "email" && field.optional)
						thing = z.email().optional()

					// ----------------------------
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


					// ----------------------------
					if (field.type == "username")
						thing = z
							.string()

				}
				return [[key, thing] as const]

			})
		).filter((item) => Object.keys(item).length > 0) // Remove any objects with 0 keys
	)

	return z.object({
		[name]: z.object(zObject)
	})
}
