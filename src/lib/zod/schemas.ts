import { Intent } from "@conform-to/react"
import { conformZodMessage } from "@conform-to/zod/v4"
import { z } from "zod"

export const loginSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	z.object({
		// The preprocess step is required for zod to perform the required check properly as the value of an empty input is usually an empty string
		email: z.preprocess(
			(value) => (value === "" ? undefined : value),
			z.email(t("errors.email-invalid")),
		),
		password: z.preprocess(
			(value) => (value === "" ? undefined : value),
			z
				.string({ error: t("errors.password-invalid") })
				.min(7, t("errors.password-too-short")),
		),
	})

export function registerSchema(
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
	// Minimize validation by checking the submission intent
	intent: Intent | null,
	// Async function to check if data is unique
	options?: {
		isValueUnique: (value: string) => Promise<boolean>
	},
) {
	return z.object({
		email: z
			.email()
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
					if (typeof options?.isValueUnique !== "function") {
						ctx.addIssue({
							code: "custom",
							message: conformZodMessage.VALIDATION_UNDEFINED,
							fatal: true,
						})
						return
					}

					// If it reaches here, then it must be validating on the server. Return the result as a promise so Zod knows it's async instead
					return options.isValueUnique(email).then((isUnique) => {
						if (!isUnique) {
							ctx.addIssue({
								code: "custom",
								message: t("errors.email-used"),
							})
						}
					})
				}),
				// eo pipe()
			),
		/* eo email ----------------------------------- */

		username: z
			.string()
			// Pipe the schema so it only runs if the email is valid
			.pipe(
				z.string().superRefine((username, ctx) => {
					// This makes Conform fall back to server validation by indicating that the validation is not defined
					if (typeof options?.isValueUnique !== "function") {
						ctx.addIssue({
							code: "custom",
							message: conformZodMessage.VALIDATION_UNDEFINED,
							fatal: true,
						})
						return
					}

					// If it reaches here, then it must be validating on the server. Return the result as a promise so Zod knows it's async instead
					return options.isValueUnique(username).then((isUnique) => {
						if (!isUnique) {
							ctx.addIssue({
								code: "custom",
								message: t("errors.email-used"),
							})
						}
					})
				}),
				// eo pipe()
			),
		/* eo username ----------------------------------- */

		password: z.preprocess(
			(value) => (value === "" ? undefined : value),
			z
				.string({ error: t("errors.password-invalid") })
				.min(7, t("errors.password-too-short")),
		),
	})
}

/*
export const registerSchema = (
	// Pass the translations object from next-intl so they can be used for zod validation errors
	t: (arg: string) => string,
) =>
	z.object({
		// The preprocess step is required for zod to perform the required check properly as the value of an empty input is usually an empty string
		email: z.preprocess(
			(value) => (value === "" ? undefined : value),
			z.email(t("errors.email-invalid")),
		),
		username: z.preprocess(
			(value) => (value === "" ? undefined : value),
			z.string(t("errors.username-invalid")),
		),
		password: z.preprocess(
			(value) => (value === "" ? undefined : value),
			z
				.string({ error: t("errors.password-invalid") })
				.min(7, t("errors.password-too-short")),
		),
	})*/
