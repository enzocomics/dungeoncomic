"use server"
/**----------------------------------- */
// I18N
import { getTranslations } from "next-intl/server"
// DIRECTUS
import { readUsers } from "@directus/sdk"
import { adminClient } from "@/lib/directus/clients"
// VALIDATION
import { parseWithZod } from "@conform-to/zod/v4"
import { registerSchema } from "@/lib/zod/schemas"

/** ------------------------------------------------ **
 * REGISTER ACTION
 */
export async function register(prevState: unknown, formData: FormData) {
	// I18N
	const t = await getTranslations("Register")

	// VALIDATION
	const submission = await parseWithZod(formData, {
		// Intent provided by parseWithZod
		schema: (intent) =>
			registerSchema(t, intent, {
				// Check if the email is uniquein Directus
				async isValueUnique(email) {
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
