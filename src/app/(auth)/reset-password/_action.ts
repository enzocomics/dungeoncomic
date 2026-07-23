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
// CMS
import { passwordRequest, passwordReset } from "@directus/sdk"
import { publicClient } from "@/lib/directus/clients"

export async function requestReset(prevState: unknown, formData: FormData) {
	// I18N
	const t = await getTranslations("auth")
	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: resetPasswordRequestSchema(t),
	})
	// SUBMIT TO DIRECTUS
	try {
		const email = formData.get("email") as string
		// Request a password reset email from Directus
		await publicClient.request(passwordRequest(email))
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

export async function submitReset(prevState: unknown, formData: FormData) {
	// I18N
	const t = await getTranslations("auth")

	// VALIDATION
	const submission = parseWithZod(formData, {
		schema: resetPasswordSubmitSchema(t),
	})

	// SUBMIT TO DIRECTUS
	try {
		const password = formData.get("password") as string
		const token = formData.get("token") as string
		// Submit the password reset request
		await publicClient.request(passwordReset(token, password))
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
