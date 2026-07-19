"use server"
/**----------------------------------- */
// I18N
import { getTranslations } from "next-intl/server"
// VALIDATION
import { parseWithZod } from "@conform-to/zod/v4"
import { loginSchema } from "@/lib/zod/schemas/pages"
// CMS
import { publicClient } from "@/lib/directus/clients"

/** ------------------------------------------------ **
 * LOGIN ACTION
 */
export async function login(prevState: unknown, formData: FormData) {
	// I18N
	const t = await getTranslations("auth")
	// VALIDATION
	const submission = parseWithZod(formData, { schema: loginSchema(t) })
	// FORM DATA
	const email = formData.get("email") as string
	const password = formData.get("password") as string

	// SUBMIT LOGIN TO DIRECTUS
	try {
		await publicClient.login({ email, password })
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
