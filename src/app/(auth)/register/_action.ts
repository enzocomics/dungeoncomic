"use server"
/**----------------------------------- */
// I18N
import { getTranslations } from "next-intl/server"
// DIRECTUS
import { readUsers } from "@directus/sdk"
import { adminClient } from "@/lib/directus/clients"
// VALIDATION
import { parseWithZod } from "@conform-to/zod/v4"
import { registerSchema } from "@/lib/zod/schemas/pages"

/** ------------------------------------------------ **
 * REGISTER ACTION
 */
export async function register(prevState: unknown, formData: FormData) {
	// I18N
	const t = await getTranslations("auth")

	// VALIDATION
	const submission = await parseWithZod(formData, {
		schema: (intent) =>
			registerSchema(t, intent, {
				// Check if the email is unique in Directus
				async isEmailUnique(email) {
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
				// Check if the email is unique in Directus
				async isUsernameUnique(username) {
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

	// ON SUBMISSION ERROR
	if (submission.status !== "success") {
		return submission.reply()
	}

	// ON SUBMISSION SUCCESS
	console.log("registered")
	// Return the submission so that the initial values can be used
	return submission.reply()
}
