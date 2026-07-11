"use server"
/**----------------------------------- */
// VALIDATION
import { z } from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { loginSchema } from "@/lib/zod/schemas"

/** ------------------------------------------------ **
 * LOGIN ACTION
 */
export async function login(prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, { schema: loginSchema })

	if (submission.status !== "success") {
		return submission.reply()
	}

	console.log("logged in")
}
