"use server"
/**----------------------------------- */
// I18N
import { getTranslations } from "next-intl/server"
// VALIDATION
import { z } from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { loginSchema } from "@/lib/zod/schemas/pages"

/** ------------------------------------------------ **
 * LOGIN ACTION
 */
export async function login(prevState: unknown, formData: FormData) {
	// I18N
	const t = await getTranslations("auth")
	// VALIDATION
	const submission = parseWithZod(formData, { schema: loginSchema(t) })

	// ON SUBMISSION ERROR
	if (submission.status !== "success") {
		return submission.reply()
	}

	// ON SUBMISSION SUCCESS
	console.log("logged in")
	// Return the submission so that the initial values can be used
	return submission.reply()
}
