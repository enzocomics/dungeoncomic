"use server"
/**----------------------------------- */
// I18N
import { getTranslations } from "next-intl/server"
// DIRECTUS
import { readUsers, registerUser, updateUser } from "@directus/sdk"
import { adminClient, publicClient, userClient } from "@/lib/directus/clients"
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

	// SUBMIT TO DIRECTUS
	try {
		// Get the form variables
		const email = formData.get("email") as string
		const password = formData.get("password") as string
		// const username = formData.get("username") as string
		// Create the user
		const response = await publicClient.request(registerUser(email, password))
		// Get the new user's ID
		// const getUserID = await adminClient.request(
		// 	readUsers({
		// 		filter: { email: { _eq: email } },
		// 		fields: ["id"],
		// 		limit: 1,
		// 	}),
		// )
		// // update the user's username
		// await adminClient.request(
		// 	updateUser(getUserID[0].id, { username: username }),
		// )
	} catch (err: any) {
		// return error if unsuccessful
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return submission.reply({
			formErrors: [reason],
		})
	}
	return submission.reply()
}
