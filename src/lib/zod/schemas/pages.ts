/**----------------------------------- */
// CONFORM & ZOD LIBRARIES
import { z, ZodObject } from "zod"
import { Intent } from "@conform-to/react"

// ZOD SCHEMAS
import { zCheckUniqueEmail, zCheckUniqueUsername } from "./async"
import {
	zCheckEmail,
	zCheckPassword,
	zCheckPasswordCreation,
	zConfirmPassword,
} from "./fields"

/**----------------------------------- */
// SCHEMA - LOGIN FORM
export const loginSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	z.object({
		email: zCheckEmail(t),
		password: zCheckPassword(t),
	})

/**----------------------------------- */
// SCHEMA - USER REGISTRATION FORM
export function registerSchema(
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
				password: zCheckPasswordCreation(t),
				passwordConfirm: zConfirmPassword(t),
			})
			// Check if the two password fields match
			.refine((data) => data.password === data.passwordConfirm, {
				error: t("errors.password-mismatch"),
				// path: which field this error appears
				path: ["passwordConfirm"],
			})
	)
}

/**----------------------------------- */
// SCHEMA - RESET PASSWORD FORM - REQUEST
export const resetPasswordRequestSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	z.object({
		email: zCheckEmail(t),
	})

// SCHEMA - RESET PASSWORD FORM - SUBMIT
export const resetPasswordSubmitSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	z
		.object({
			password: zCheckPassword(t),
			passwordConfirm: zConfirmPassword(t),
		})
		// Check if the two password fields match
		.refine((data) => data.password === data.passwordConfirm, {
			error: t("errors.password-mismatch"),
			// path: which field this error appears
			path: ["passwordConfirm"],
		})
