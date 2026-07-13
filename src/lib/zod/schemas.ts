/**----------------------------------- */
// CONFORM/ZOD LIBRARIES
import { Intent } from "@conform-to/react"
import { conformZodMessage } from "@conform-to/zod/v4"
import { z, ZodObject } from "zod"

/**----------------------------------- */
// SCHEMA - LOGIN FORM
export const loginSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	z.object({
		// Preprocess: transform data before validation
		email: z.preprocess(
			// if the field is blank, treat it as undefined
			(value) => (value === "" ? undefined : value),
			z
				.string({ error: t("errors.input-blank") })
				.email({ error: t("errors.email-invalid") }),
		),
		// Preprocess: transform data before validation
		password: z.preprocess(
			// if the field is blank, treat it as undefined
			(value) => (value === "" ? undefined : value),
			z
				.string({ error: t("errors.password-invalid") })
				.min(7, t("errors.password-too-short")),
		),
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
				/* validate email ----------------------------------- */
				email: z
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
					),

				/* validate username ----------------------------------- */
				username: z
					.string({ error: t("errors.input-blank") })
					.min(2, { error: t("errors.username-length") })
					.max(24, { error: t("errors.username-length") })
					.regex(/^[a-z]+$/, { error: t("errors.username-invalid") })
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
								(intent.type === "validate" &&
									intent.payload.name === "username")

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
					),
				/* eo username ----------------------------------- */

				// Preprocess: transform data before validation
				password: z.preprocess(
					(value) => (value === "" ? undefined : value),
					z
						.string({ error: t("errors.input-blank") })
						.min(7, t("errors.password-too-short")),
				),

				// Preprocess: transform data before validation
				passwordConfirm: z.preprocess(
					(value) => (value === "" ? undefined : value),
					z.string({ error: t("errors.input-blank") }),
				),
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
// SCHEMA - RESET PASSWORD FORM

export const resetPasswordRequestSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	z.object({
		// Preprocess: transform data before validation
		email: z.preprocess(
			// if the field is blank, treat it as undefined
			(value) => (value === "" ? undefined : value),
			z.email(t("errors.email-invalid")),
		),
	})

export const resetPasswordSubmitSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	z.object({
		// Preprocess: transform data before validation
		password: z.preprocess(
			// if the field is blank, treat it as undefined
			(value) => (value === "" ? undefined : value),
			z
				.string({ error: t("errors.password-invalid") })
				.min(7, t("errors.password-too-short")),
		),
		// Preprocess: transform data before validation
		confirmPassword: z.preprocess(
			// if the field is blank, treat it as undefined
			(value) => (value === "" ? undefined : value),
			z
				.string({ error: t("errors.password-invalid") })
				.min(7, t("errors.password-too-short")),
		),
	})
