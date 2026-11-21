/**----------------------------------- */

import { zCheckUniqueEmail, zCheckUniqueUsername } from "@/lib/zod/schemas/async"
import { zCheckPasswordCreation, zConfirmPassword } from "@/lib/zod/schemas/fields"
import { Intent } from "@conform-to/react"
import z, { ZodObject } from "zod"

// SCHEMA - USER ACCOUNT PAGE
export function accountSchema(
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
	// Minimize validation by checking the submission intent
	intent: Intent | null,
	// Async function to check if data is unique
	options?: {
		isEmailUnique: (value: string) => Promise<boolean>
		isUsernameUnique: (value: string) => Promise<boolean>
	},
): ZodObject {
	return (
		z
			.object({
				email: zCheckUniqueEmail(t, intent, options), // async
				username: zCheckUniqueUsername(t, intent, options), // async
				password: zCheckPasswordCreation(t).optional(),
				passwordConfirm: zConfirmPassword(t).optional(),
			})
			// Check if the two password fields match
			.refine((data) => data.password === data.passwordConfirm, {
				error: t("errors.password-mismatch"),
				// path: which field this error appears
				path: ["passwordConfirm"],
			})
	)
}