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
