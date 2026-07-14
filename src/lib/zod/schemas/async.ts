import { z } from "zod"
import { conformZodMessage } from "@conform-to/zod/v4"
import { Intent } from "@conform-to/react"

/**----------------------------------- */
// SCHEMA - EMAIL UNIQUENESS CHECK (ASYNC)
export const zCheckUniqueEmail = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
	// Minimize validation by checking the submission intent
	intent: Intent | null,
	// Async function to check if data is unique
	options?: {
		isEmailUnique: (value: string) => Promise<boolean>
		isUsernameUnique: (value: string) => Promise<boolean>
	},
) =>
	z
		.string(t("errors.input-blank"))
		.email(t("errors.email-invalid"))
		// Pipe the schema so it only runs if the email is valid
		.pipe(
			z.string().superRefine((email, ctx) => {
				// Check the submission intent
				const isValidatingEmail =
					intent === null ||
					(intent.type === "validate" && intent.payload.name === "email")

				if (!isValidatingEmail) {
					ctx.addIssue({
						code: "custom",
						message: conformZodMessage.VALIDATION_SKIPPED,
					})
					return
				}

				// This makes Conform fall back to server validation by indicating that the validation is not defined
				if (typeof options?.isEmailUnique !== "function") {
					ctx.addIssue({
						code: "custom",
						message: conformZodMessage.VALIDATION_UNDEFINED,
						fatal: true,
					})
					return
				}

				// If it reaches here, then it must be validating on the server. Return the result as a promise so Zod knows it's async instead
				return options.isEmailUnique(email).then((isUnique) => {
					if (!isUnique) {
						ctx.addIssue({
							code: "custom",
							message: t("errors.email-taken"),
						})
					}
				})
			}),
			// eo pipe()
		)

/**----------------------------------- */
// SCHEMA - USERNAME UNIQUENESS CHECK (ASYNC)
export const zCheckUniqueUsername = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
	// Minimize validation by checking the submission intent
	intent: Intent | null,
	// Async function to check if data is unique
	options?: {
		isEmailUnique: (value: string) => Promise<boolean>
		isUsernameUnique: (value: string) => Promise<boolean>
	},
) =>
	z
		.string({ error: t("errors.input-blank") })
		.min(2, { error: t("errors.username-too-short") })
		.max(20, { error: t("errors.username-too-long") })
		.regex(/^[^-_.]/, { error: t("errors.username-cannot-start-with") })
		.regex(/[^-_.]$/, { error: t("errors.username-cannot-end-with") })
		.regex(/^(?!.*[._-]{2})[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/, {
			error: t("errors.username-invalid"),
		})
		// Pipe the schema so it only runs if the username  is valid
		.pipe(
			z.string().superRefine((username, ctx) => {
				/**
				 * `intent` is provided by `parseWithZod`. We check the submission intent
				 * to verify which field is being validated, and then skips it validation step.
				 * The purpose of this is because the schema usually validates all fields at once.
				 * Skipping async field is much less expensive (server request/load-wise)
				 */
				const isValidatingUsername =
					intent === null ||
					(intent.type === "validate" && intent.payload.name === "username")

				// This make Conform to use the previous result instead  by indicating that the validation is skipped
				if (!isValidatingUsername) {
					ctx.addIssue({
						code: "custom",
						message: conformZodMessage.VALIDATION_SKIPPED,
					})
					return
				}
				// This makes Conform fall back to server validation by indicating that the validation is not defined
				if (typeof options?.isUsernameUnique !== "function") {
					ctx.addIssue({
						code: "custom",
						message: conformZodMessage.VALIDATION_UNDEFINED,
						fatal: true,
					})
					return
				}

				// If it reaches here, then it must be validating on the server. Return the result as a promise so Zod knows it's async instead
				return options.isUsernameUnique(username).then((isUnique) => {
					if (!isUnique) {
						ctx.addIssue({
							code: "custom",
							message: t("errors.username-taken"),
						})
					}
				})
			}),
			// eo pipe()
		)
