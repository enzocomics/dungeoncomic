"use server"
/**----------------------------------- */
// I18N
import { getTranslations } from "next-intl/server"
// VALIDATION
import { z } from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import {
	resetPasswordRequestSchema,
	resetPasswordSubmitSchema,
} from "@/lib/zod/schemas/pages"

export async function requestReset(prevState: unknown, formData: FormData) {
	// I18N
	const t = await getTranslations("auth")
	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: resetPasswordRequestSchema(t),
	})

	return submission.reply()
}

export async function submitReset(prevState: unknown, formData: FormData) {
	// I18N
	const t = await getTranslations("auth")

	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: resetPasswordSubmitSchema(t),
	})
}
