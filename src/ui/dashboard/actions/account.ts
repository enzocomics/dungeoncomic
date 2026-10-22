"use server"

import { parseWithZod } from "@conform-to/zod/v4"
import { dashboardSchema } from "../functions/schema"

export async function saveAccount(prevState: unknown, formData: FormData) {
	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: dashboardSchema("directus_users"),
	})

	// RETURN REPLY so that its last value may be used
	return submission.reply()
}
